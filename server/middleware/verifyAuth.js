const jwt = require('jsonwebtoken');
const verifyAuth = (req,res,next)=>{
   try{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).send("Access denied");
    }
        // move secret to env
    const decode = jwt.verify(token,"secret");
        
    //decode the userId from token and addd it to req object to use it in next function
    req.userId = decode.userId;
    next();
   } catch(err){
    res.status(400).send("invalid token")
   }
}
module.exports= {verifyAuth}