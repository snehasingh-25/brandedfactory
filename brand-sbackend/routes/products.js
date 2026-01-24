import express from "express";
import pkg from "@prisma/client";
import { verifyToken } from "../utils/auth.js";
import upload, { getImageUrl } from "../utils/upload.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// Get all products (public)
router.get("/", async (req, res) => {
  try {
    const { category, brand, isNew, isTrending, search } = req.query;
    
    // Build where clause
    const where = {};
    if (category) {
      where.category = { slug: category };
    }
    if (brand) {
      where.brands = {
        some: {
          brand: {
            slug: brand
          }
        }
      };
    }
    if (isNew === "true") {
      where.isNew = true;
    }
    if (isTrending === "true") {
      where.isTrending = true;
    }
    if (search) {
      // First, try to find matching brands
      const matchingBrands = await prisma.brand.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { slug: { contains: search.toLowerCase().replace(/\s+/g, '-') } },
          ],
          isActive: true
        },
        select: { id: true }
      });

      const brandIds = matchingBrands.map(b => b.id);

      // Search in name, description, keywords, and brands
      const searchConditions = [
        { name: { contains: search } },
        { description: { contains: search } },
        { name: { startsWith: search } }, // Partial match at start
      ];

      // If matching brands found, include products linked to those brands
      if (brandIds.length > 0) {
        searchConditions.push({
          brands: {
            some: {
              brandId: { in: brandIds }
            }
          }
        });
      }

      where.OR = searchConditions;
    }

    const products = await prisma.product.findMany({
      where,
      include: { 
        sizes: true,
        category: true,
        brands: {
          include: {
            brand: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    // Parse JSON fields
    const parsed = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
      keywords: p.keywords ? JSON.parse(p.keywords) : [],
      brands: p.brands ? p.brands.map(pb => pb.brand) : [],
    }));

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { 
        sizes: true,
        category: true,
        brands: {
          include: {
            brand: true
          }
        }
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      keywords: product.keywords ? JSON.parse(product.keywords) : [],
      brands: product.brands ? product.brands.map(pb => pb.brand) : [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add product (Admin only)
router.post("/", verifyToken, upload.array("images", 10), async (req, res) => {
  try {
    const {
      name,
      description,
      details,
      specifications,
      careInstructions,
      returnPolicy,
      badge,
      isNew,
      isTrending,
      categoryId,
      sizes,
      keywords,
      brandIds,
    } = req.body;

    // Upload images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await getImageUrl(file);
        imageUrls.push(url);
      }
    }

    // Parse sizes and keywords
    const sizesArray = sizes ? JSON.parse(sizes) : [];
    const keywordsArray = keywords ? JSON.parse(keywords) : [];

    // Convert price strings to floats for sizes
    const sizesWithFloatPrices = sizesArray.map(size => ({
      label: size.label,
      price: parseFloat(size.price) || 0,
      marketPrice: size.marketPrice ? parseFloat(size.marketPrice) : null,
      mrp: size.mrp ? parseFloat(size.mrp) : null,
    }));

    // Parse brand IDs
    const brandIdsArray = brandIds ? JSON.parse(brandIds) : [];

    const product = await prisma.product.create({
      data: {
        name,
        description,
        details: details || null,
        specifications: specifications || null,
        careInstructions: careInstructions || null,
        returnPolicy: returnPolicy || null,
        badge: badge || null,
        isNew: isNew === "true" || isNew === true,
        isTrending: isTrending === "true" || isTrending === true,
        categoryId: Number(categoryId),
        images: JSON.stringify(imageUrls),
        keywords: JSON.stringify(keywordsArray),
        sizes: {
          create: sizesWithFloatPrices,
        },
        brands: {
          create: brandIdsArray.map(brandId => ({
            brandId: Number(brandId)
          }))
        }
      },
      include: { 
        sizes: true,
        brands: {
          include: {
            brand: true
          }
        }
      },
    });

    res.json({
      ...product,
      images: imageUrls,
      keywords: keywordsArray,
      brands: product.brands ? product.brands.map(pb => pb.brand) : [],
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update product (Admin only)
router.put("/:id", verifyToken, upload.array("images", 10), async (req, res) => {
  try {
    const {
      name,
      description,
      details,
      specifications,
      careInstructions,
      returnPolicy,
      badge,
      isNew,
      isTrending,
      categoryId,
      sizes,
      keywords,
      existingImages,
      brandIds,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle images
    let imageUrls = existingImages ? JSON.parse(existingImages) : [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await getImageUrl(file);
        imageUrls.push(url);
      }
    }

    // Parse sizes and keywords
    const sizesArray = sizes ? JSON.parse(sizes) : [];
    const keywordsArray = keywords ? JSON.parse(keywords) : [];

    // Convert price strings to floats for sizes
    const sizesWithFloatPrices = sizesArray.map(size => ({
      label: size.label,
      price: parseFloat(size.price) || 0,
      marketPrice: size.marketPrice ? parseFloat(size.marketPrice) : null,
      mrp: size.mrp ? parseFloat(size.mrp) : null,
    }));

    // Delete old sizes and create new ones
    await prisma.productSize.deleteMany({
      where: { productId: Number(req.params.id) },
    });

    // Delete old brand links
    await prisma.productBrand.deleteMany({
      where: { productId: Number(req.params.id) },
    });

    // Parse brand IDs
    const brandIdsArray = brandIds ? JSON.parse(brandIds) : [];

    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        description,
        details: details || null,
        specifications: specifications || null,
        careInstructions: careInstructions || null,
        returnPolicy: returnPolicy || null,
        badge: badge || null,
        isNew: isNew === "true" || isNew === true,
        isTrending: isTrending === "true" || isTrending === true,
        categoryId: Number(categoryId),
        images: JSON.stringify(imageUrls),
        keywords: JSON.stringify(keywordsArray),
        sizes: {
          create: sizesWithFloatPrices,
        },
        brands: {
          create: brandIdsArray.map(brandId => ({
            brandId: Number(brandId)
          }))
        }
      },
      include: { 
        sizes: true,
        brands: {
          include: {
            brand: true
          }
        }
      },
    });

    res.json({
      ...product,
      images: imageUrls,
      keywords: keywordsArray,
      brands: product.brands ? product.brands.map(pb => pb.brand) : [],
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product (Admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
