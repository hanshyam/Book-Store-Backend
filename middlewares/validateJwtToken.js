import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// Middleware to verify JWT and attach user to req
export const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = JWT.verify(token, process.env.MY_JWT_STRING);

      const user = await userModel.findById(decoded._id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Token invalid or expired" });
    }
  } else {
    return res.status(401).json({ message: "Authorization token missing" });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};
