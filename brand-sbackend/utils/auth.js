import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const raw = req.headers.authorization?.split(" ")[1];
    const token = raw?.trim();

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Read secret at request time so it's always current (avoids undefined when module loaded before env)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set in environment");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT verify failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
