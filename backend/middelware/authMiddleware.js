const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next) =>{
  try {
    // get authorization header
    const authHeader = req.headers.authorization;

    //check token exists
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({
        message:"Access denied. No token provided"
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // store user ID in request 
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message:"Invalid or expired token"
    })
  }
}

module.exports = authMiddleware;