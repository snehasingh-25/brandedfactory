import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import orderRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import cartRoutes from "./routes/cart.js";
import reelRoutes from "./routes/reels.js";
import brandRoutes from "./routes/brands.js";
import bannerRoutes from "./routes/banners.js";

dotenv.config();

// In production, JWT_SECRET must be set and must match across deployments.
// If you migrate servers (e.g. Render → Digital Ocean), admins must log out and log in again
// so new tokens are signed with the current server's secret.
const jwtSecret = process.env.JWT_SECRET;
if (process.env.NODE_ENV === "production" && (!jwtSecret || jwtSecret === "your-secret-key-change-in-production")) {
  console.warn("⚠️  JWT_SECRET is missing or default in production. Set a strong secret in your environment.");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS: allow frontend origin and Authorization header (required for admin create/update).
// Set FRONTEND_URL to your production URL (e.g. https://brandedfactorybhilwara.com).
// Local dev (localhost:5173) is always allowed.
const frontendUrl = process.env.FRONTEND_URL?.trim();
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(frontendUrl ? [frontendUrl] : []),
];
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, false);
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
  res.send("Backend is alive 🌱");
});

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);
app.use("/cart", cartRoutes);
app.use("/reels", reelRoutes);
app.use("/brands", brandRoutes);
app.use("/banners", bannerRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
