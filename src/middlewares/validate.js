const validate = (schema)=>
    (req,res,next)=>{

        const result = schema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                success : false,
                message : "Validaion error",
                error : result.error.format()
            });
        }

        next();
    }



module.exports = {validate}