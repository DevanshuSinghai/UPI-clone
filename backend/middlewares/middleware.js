const {JWT_SECRET} = require("../KEYS/config");
const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) =>{

    const token = req.headers.authorization
    
    if(!token || !token.startsWith("Bearer ")){
        return res.status(403).json({
            msg: "You don't have any account, Please signup"
        })
    }

    const jwtToken = token.split(" ")[1]
    try{
        const decodedValue = jwt.verify(jwtToken, JWT_SECRET)
        
        if(decodedValue.userId){
            req.userId = decodedValue.userId
            next()
        }else{
            return res.status(403).json({
                msg: "Token does not match with userId"
            })
        }
    }catch(err){
        return res.status(403).json({})
    }
}

module.exports = {
    authMiddleware
}