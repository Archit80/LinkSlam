import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const authMiddleware = (req, res, next) => {
  const token =  req.cookies.token || req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) return res.status(401).json({ message: "No token, not authorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains `id`
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
