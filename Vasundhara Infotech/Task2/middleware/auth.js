const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).json({ msg: "Token is required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

const authorize = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                msg:"Access Denied"
            })
        }
        next();
    }
}

module.exports = { verifyToken, authorize };
