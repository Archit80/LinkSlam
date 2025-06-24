import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) return res.status(401).json({ msg: "No token, not authorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains `id`
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
  }
};
