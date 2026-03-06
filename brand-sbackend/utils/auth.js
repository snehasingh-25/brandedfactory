import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const verifyToken = (req, res, next) => {
  try {
    const raw = req.headers.authorization?.split(" ")[1];
    const token = raw?.trim();

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("JWT verify failed:", error.message);
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
