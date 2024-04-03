require('dotenv').config();

/**
 * Middleware to authenticate and verify JWT token.
 * Extracts the token from the Authorization header, verifies it, 
 * and if valid, attaches the decoded user to the request object.
 */
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Expected format: "Bearer <TOKEN>"

  if (!token) {
    // If no token is found, return an unauthorized status
    return res.status(401).json({ message: "A token is required for authentication" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // If token is invalid or expired, return a forbidden status
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user; // Attach the decoded token (user info) to the request object
    next(); // Proceed to the next middleware/route handler
  });
};

module.exports = authenticateToken;
