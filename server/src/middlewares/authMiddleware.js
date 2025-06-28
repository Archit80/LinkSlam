import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  
  // console.log("Token received:", token); // Debug line
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded); // Debug line
    req.user = decoded;
    next();
  } catch (error) {
    // console.log("Token verification error:", error.message); // Debug line
    res.status(400).json({ message: "Invalid token." });
  }
};
