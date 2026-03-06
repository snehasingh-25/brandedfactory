import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  try {
    const raw = req.headers.authorization?.split(" ")[1];
   // const token = raw?.trim();

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    console.log(raw);
    console.log(process.env.JWT_SECRET);
   

    const decoded = jwt.verify(raw,JWT_SECRET);
    req.userId = decoded.userId;
    console.log("JWT verify successful");
    console.log(decoded);
    next();
  } catch (error) {
    // Always log server-side (never sent to client) so you can see "expired" vs "invalid signature"
    console.log("bad token");
    console.error("JWT verify failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
