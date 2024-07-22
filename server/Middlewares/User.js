const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');



dotenv.config();
const jwt_secret_key = process.env.JWT_SECRET_KEY;


//verify for sql user auth
const verifytoken = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, jwt_secret_key);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    req.user = null;
    return res.status(401).json({ error: "Token verification failed" });
  }
};



module.exports = {
  verifytoken,
  
  
};