import express from "express";
import pkg from "@prisma/client";
import { verifyToken } from "../utils/auth.js";
import upload, { getImageUrl } from "../utils/upload.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// Get all brands (public)
router.get("/", async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all brands (admin - includes inactive)
router.get("/all", verifyToken, async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single brand (public)
router.get("/:slug", async (req, res) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          include: {
            product: {
              include: {
                sizes: true,
                category: true,
              }
            }
          }
        },
        _count: {
          select: { products: true }
        }
      },
    });

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Transform products
    const products = brand.products.map(pb => {
      const p = pb.product;
      return {
        ...p,
        images: p.images ? JSON.parse(p.images) : [],
        keywords: p.keywords ? JSON.parse(p.keywords) : [],
      };
    });

    res.json({
      ...brand,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create brand (Admin only)
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, slug, description, isActive } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await getImageUrl(req.file);
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        description: description || null,
        imageUrl,
        isActive: isActive === "true" || isActive === true,
      },
    });

    res.json(brand);
  } catch (error) {
    console.error("Create brand error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update brand (Admin only)
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, slug, description, isActive, existingImage } = req.body;

    const existingBrand = await prisma.brand.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existingBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    let imageUrl = existingImage || existingBrand.imageUrl;
    if (req.file) {
      imageUrl = await getImageUrl(req.file);
    }

    const brand = await prisma.brand.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        slug,
        description: description || null,
        imageUrl,
        isActive: isActive === "true" || isActive === true,
      },
    });

    res.json(brand);
  } catch (error) {
    console.error("Update brand error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete brand (Admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await prisma.brand.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Delete brand error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
