const path = require('path');
const {prisma} = require('../../configs/prisma');
const {checkPermission} = require('./services/checkPermissionService')
const {addMaterial} = require('./services/createMaterialSevice');
const { roles } = require('../../utils/roles');


const uploadFile = async (req,res)=>{
    try{

        const user = req.userInfo;
        const {targetType ,targetId,fileType} = req.body;
        const file = req.file;

        if(!file){
            return res.status(400).json({
                success : false,
                message : "لم يتم رفع الملف"
            })
        }

        checkPermission(user.roles.map(r=>r?.role.name),fileType);
        
        const savedFile = await prisma.file.create({
        data : {
            originalName : file.originalname,
            fileName : file.filename,
            path: file.path,
            size : file.size,
            type : fileType,
            uploadedById : user.userId,
            extension : path.extname(file.originalname).toLowerCase()
            }
        })

        if(!savedFile){
            return res.status(400).json({
                success : false,
                message : "حدث خطأ في رفع الملف"
            })
        }

        await addMaterial(user,savedFile.id,targetType,targetId);
        
        res.status(201).json({
            success : true,
            message : "تم رفع الملف بنجاح"
        });


    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

const getAllowedTypes = (req,res)=>{
    try{
        const userRoles = req.userInfo.roles.map(role => role?.role.name)

        if(userRoles.includes(roles.STDUENT)){
            res.status(200).json({
                success : true,
                message : 'تم جلب الأنواع بنجاح',
                data : ['إمتحان','ملخص']
            });
        }
        if(userRoles.includes(roles.DOCTOR) || userRoles.includes(roles.ADMIN)){
            res.status(200).json({
                success : true,
                message : 'تم جلب الأنواع بنجاح',
                data : ['إمتحان','ملخص','محتوى المقرر كاملاً','محاضرة','ملف مساعد']
            });
        }

    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

const approveMaterial = async (req,res)=>{
    try{

        const material = await prisma.courseMaterial.findUnique({where : {id : req.params.id}});

        if(!material){
            return res.status(404).json({
                success : false,
                message : "الملف غير موجود"
            });
        }

        await prisma.courseMaterial.update({where : {id:material.id},data:{status : 'تم التأكيد'}})

        res.status(200).json({
            success : true,
            message : "تمت الموافقة بنجاح"
        });
        
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

module.exports = {uploadFile,getAllowedTypes,approveMaterial}
