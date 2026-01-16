const jwt = require('jsonwebtoken')

const authenticateMiddleware = (req,res,next)=>{
    const token = req.cookies?.auth_token;
    if(!token){
        
        return res.status(401).json({
            success : false,
            message : "يجب تسجيل الدخول أولاً",
            error : error.message
        })
    }
    try{
        
        const tokenInfo = jwt.verify(token,process.env.JWT_PRIVATE_KEY);
        req.userInfo = tokenInfo

        next()
    }catch(error){
        return res.status(401).json({
            success : false,
            message : "يجب تسجيل الدخول أولاً",
            error : error.message
        })
    }
}



const authorizationMiddleware = (role)=>(req,res,next)=>{
    
    const roles = req.userInfo.roles
    if(!roles && roles.length == 0){
        
        return res.status(403).json({
            success : false,
            message : "forbidden"
        })
    }

    if(!roles.map(r=>r.role.name).includes(role)){
        return res.status(403).json({
            success : false,
            message : "forbidden"
        });
    }

    next();
}


module.exports = {authenticateMiddleware , authorizationMiddleware}