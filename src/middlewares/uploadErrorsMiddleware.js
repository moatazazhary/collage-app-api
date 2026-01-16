const { MulterError } = require("multer")
const { fileUploadError } = require("../errors/fileUploadErrors")
const multer = require("multer")


const uploadErrorHandler = (req,res,next)=>{
    return function(error){
        if(!error)
            return next()

        if(error instanceof fileUploadError ){
            return res.status(error.statusCode).json({
                success : false,
                message : error.message
            })
        }

        if(error instanceof multer.MulterError){
            if (error.code === "LIMIT_FILE_SIZE"){
                return res.status(413).json({
                    success :false,
                    message : "حجم الملف غير مسموح  ، يجب ألا يتجاوز ال 10MB"
                })
            }
        }

        return res.status(400).json({
            success : false,
            message : "خطأ في رفع الملف"
        })
    }
}

module.exports = {uploadErrorHandler}