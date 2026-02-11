import express from "express";
import pkg from "@prisma/client";
import { verifyToken } from "../utils/auth.js";
import upload, { getImageUrl } from "../utils/upload.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// Get all categories (public)
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single category (public)
router.get("/:id", async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(req.params.id) },
      include: { products: { include: { sizes: true } } },
    });
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create category (Admin only)
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = await getImageUrl(req.file);
    }

    const category = await prisma.category.create({
      data: { 
        name, 
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        description: description || null,
        imageUrl: imageUrl || null,
      },
    });
    res.json(category);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Slug already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update category (Admin only)
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, slug, description, existingImageUrl } = req.body;
    
    let imageUrl = existingImageUrl || null;
    if (req.file) {
      imageUrl = await getImageUrl(req.file);
    }

    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: { 
        name, 
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        description: description || null,
        imageUrl: imageUrl || null,
      },
    });
    res.json(category);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Slug already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete category (Admin only)
// If the category has products, they are reassigned to another category before deletion.
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category._count.products > 0) {
      const otherCategory = await prisma.category.findFirst({
        where: { id: { not: categoryId } },
        orderBy: { name: "asc" },
      });

      if (!otherCategory) {
        return res.status(400).json({
          message:
            "Cannot delete the only category while it has products. Create another category, move or delete the products, then try again.",
        });
      }

      await prisma.product.updateMany({
        where: { categoryId },
        data: { categoryId: otherCategory.id },
      });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(400).json({
        message:
          "Cannot delete category because it is still in use. Please remove or reassign products first.",
      });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
