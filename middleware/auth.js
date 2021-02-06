const jwt = require('jsonwebtoken')
const config = require('config')


const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({msg : "Unauthorized access"});  

    const secret = config.get("jwtsecret");
    try{
        const decoded = jwt.verify(token, secret);
        req.user = decoded;

        next();
    }
    catch(err){
        res.status(401).json({msg : "Invalid token"});
    }

}
module.exports = auth