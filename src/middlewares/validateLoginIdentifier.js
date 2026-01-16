const validateLoginIdentifier = (req,res,next)=>{
    const {identifier } = req.body

    const emailRegex = /^[a-zA-Z0-9_+-]+@(gmail\.com|outlook\.com|outlook\.sa|hotmail\.com)$/
    const studentIdRegex = /^\d{2}\/\d{2,8}$/

    if(identifier.includes("@")){
        if(!emailRegex.test(identifier)){
            return res.status(400).json({
                success : false,
                message : "البريد الإلكتروني غير صحيح"
            });
        }
    }else{
        if(!studentIdRegex.test(identifier)){
            return res.status(400).json({
                success : false,
                message : "الرقم الجامعي غير صحيح"
            })
        }
    }

    next();
}

module.exports = {validateLoginIdentifier}