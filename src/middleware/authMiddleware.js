const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Assumes token is passed as Bearer token

  if (!token) {
    return res.status(403).json({ message: "Access denied, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  
    // console.log('req.user from middleware:',req.user.userId)
   
    next(); 
    
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
