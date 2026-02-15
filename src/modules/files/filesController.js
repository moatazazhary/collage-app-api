const path = require('path');
const {prisma} = require('../../configs/prisma');
const {checkPermission} = require('./services/checkPermissionService')
const {addMaterial} = require('./services/createMaterialSevice');
const { roles } = require('../../utils/roles');
const { pagenation } = require('../core/pagenationService');


const uploadFile = async (req,res)=>{
    try{

        const user = req.userInfo;
        const {targetType ,targetId,fileType} = req.body;
        const file = req.file;

        console.log('file : ',file);
        console.log('targetType : ',targetType);
          console.log('targetId : ',targetId);
        console.log('fileType : ',fileType);
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
            path: path.relative(process.env.UPLOADS_DIR , file.path).replace('/\\/g','/'),
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


const getAllFiles = async (req,res)=>{
    try{

        const dataLenght = await prisma.doctor.count()
            
        const pagenationOptions = pagenation(req.query.page,req.query.limit,dataLenght,req.query.sort)

        const files = await prisma.file.findMany({
            skip : pagenationOptions.skip,
            take : pagenationOptions.limit,
                include:{
                    user:true,
                    material:{
                        include:{
                            course:{
                                include:{
                                    department:true,
                                    semester:true
                                }
                            },
                        }
                    },
                    exams:{
                        include:{
                            department:true,
                            semester:true,
                        }
                    },
                    research:{
                        include:{
                            department:true,
                        }
                    }
                }});


        res.status(200).json({
            success : true,
            message:"تم تحميل البيانات بنجاح",
            data:files.map(file=>(
                {
                    id:file.id,
                    createdAt:file.createdAt,
                    type:file.type,
                    uploadedBy:file.user.fullname,
                    status:getOtherDetails(file.type,file)?.status,
                    semester:getOtherDetails(file.type,file)?.semester,
                    department:getOtherDetails(file.type,file)?.department,
                    courseName:getOtherDetails(file.type,file)?.courseName,
                }
            )),
            totalData : dataLenght,
            currentPage : pagenationOptions.page,
            totalPages : pagenationOptions.totalPages
        });
        
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

const getUserFiles = async (req,res)=>{
    try{

        const dataLenght = await prisma.doctor.count()
            
        const pagenationOptions = pagenation(req.query.page,req.query.limit,dataLenght,req.query.sort)
        const user = req.userInfo;

        const files = await prisma.file.findMany({
            where:{
                uploadedById:user.userId,
                AND:[
                    {
                        OR:[
                                {
                                    material:{
                                        is:{
                                            status:'تم التأكيد'
                                        }
                                    }
                                },
                                {
                                    exams:{
                                        is:{
                                            status:'تم التأكيد'
                                        }
                                    }
                                },
                                {
                                    research:{
                                        is:{
                                            status:'تم التأكيد'
                                    }
                                    }
                                }
                            ]
                    }
                ]
            },
            select:{
                id:true,
                extension:true,
                type:true,
                path:true,
                user:{
                    select:{
                        fullname:true,
                        id:true,
                    }
                },
                material:{
                    select:{
                        course:{
                            select:{
                                department:true,
                                semester:true
                            }
                        },
                        lecture:true,
                    }
                },
                exams:{
                    select:{
                        department:true,
                        semester:true,
                    }
                },
                research:{
                    select:{
                        department:true,
                    }
                }

            },
            skip : pagenationOptions.skip,
            take : pagenationOptions.limit});

        res.status(200).json({
            success : true,
            message:"تم تحميل البيانات بنجاح",
            data:files.map(file=>(
                {
                    id:file.id,
                    type:file.type,
                    extension:file.extension,
                    path:file.path,
                    title:getOtherDetails(file.type,file)?.title
                }
            )),
            totalData : dataLenght,
            currentPage : pagenationOptions.page,
            totalPages : pagenationOptions.totalPages
        });
        
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

const getUserFileRequests = async (req,res)=>{
    try{

        // const dataLenght = await prisma.doctor.count()
            
        // const pagenationOptions = pagenation(req.query.page,req.query.limit,dataLenght,req.query.sort)
        const user = req.userInfo;

        const files = await prisma.file.findMany({
            where:{
                uploadedById:user.userId,
            },
            select:{
                id:true,
                extension:true,
                type:true,
                path:true,
                user:{
                    select:{
                        fullname:true,
                        id:true,
                    }
                },
                material:{
                    select:{
                        course:{
                            select:{
                                department:true,
                                semester:true
                            }
                        },
                        lecture:true,
                        status:true
                    }
                },
                exams:{
                    select:{
                        department:true,
                        semester:true,
                        status:true
                    }
                },
                research:{
                    select:{
                        department:true,
                        status:true
                    }
                }

            }});

        res.status(200).json({
            success : true,
            message:"تم تحميل البيانات بنجاح",
            data:files.map(file=>(
                {
                    id:file.id,
                    type:file.type,
                    extension:file.extension,
                    path:file.path,
                    title:getOtherDetails(file.type,file)?.title,
                    status:getOtherDetails(file.type,file)?.status
                }
            ))
        });
        
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

const searchFile = async (req,res)=>{
    try{

        const dataLenght = await prisma.doctor.count()
        
        const search = req.query.search;
        const departments = Array.isArray(req.query.departments) ? req.query.departments : req.query.departments ? [req.query.departments] :[] ;
        const pagenationOptions = pagenation(req.query.page,req.query.limit,dataLenght,req.query.sort)
        let where = {};
        const AND=[];
        if(search){
            AND.push({
                OR:[
                    {
                        material:{
                            is:{
                                course:{
                                    is:{
                                        name:{
                                            contains:search,
                                            mode:'insensitive'
                                        },
                                    }
                                },
                                status:'تم التأكيد'
                            }
                        }
                    },
                    {
                        material:{
                            is:{
                                lecture:{
                                    is:{
                                        title:{
                                            contains:search,
                                            mode:'insensitive'
                                        },
                                    }
                                },
                                status:'تم التأكيد'
                            }
                        }
                    },
                    {
                        exams:{
                            is:{
                                title:{
                                    contains:search,
                                    mode:'insensitive'
                                },
                                status:'تم التأكيد'
                            }
                        }
                    },
                    {
                        research:{
                            is:{

                                title:{
                                    contains:search,
                                    mode:'insensitive'
                                },
                                status:'تم التأكيد'
                        }
                        }
                    }
                ]})

            if(departments && departments?.length>0){
                AND.push({
                    OR:[
                        {
                            material:{
                                is:{
                                    course:{
                                        is:{
                                            department:{
                                                is:{
                                                    title:{
                                                        in:departments,
                                                        mode:'insensitive'
                                                    }
                                                }
                                            }
                                            
                                        }
                                    }
                                }
                            }
                        }
                        ,
                        {
                        exams:{
                            is:{
                                department:{
                                    is:{
                                        title:{
                                            in:departments,
                                            mode:'insensitive'
                                        }
                                    }
                                }
                            }
                        }
                    },{
                        research:{
                            is:{
                                department:{
                                    is:{
                                        title:{
                                            in:departments,
                                            mode:'insensitive'
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ]
                })
            }
        }
        where = AND.length>0?{AND} : {}
        const files = await prisma.file.findMany({
            where,
            skip : pagenationOptions.skip,
            take : pagenationOptions.limit,
             orderBy : {
                createdAt :pagenationOptions.sort
            },
                include:{
                    user:true,
                    material:{
                        include:{
                            course:{
                                include:{
                                    department:true,
                                    semester:true
                                }
                            },
                            lecture:true,
                        }
                    },
                    exams:{
                        include:{
                            department:true,
                            semester:true,
                        }
                    },
                    research:{
                        include:{
                            department:true,
                        }
                    }
                }});

        res.status(200).json({
            success : true,
            message:"تم تحميل البيانات بنجاح",
            data:files.map(file=>(
                {
                    id:file.id,
                    createdAt:file.createdAt,
                    type:file.type,
                    uploadedBy:file.user.fullname,
                    extension:file.extension,
                    path:file.path,
                    size:file.size,
                    department: getOtherDetails(file.type,file)?.department,
                    title: getOtherDetails(file.type,file)?.title
                }
            )),
            totalData : dataLenght,
            currentPage : pagenationOptions.page,
            totalPages : pagenationOptions.totalPages
        });
        
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}
const getFile = async (req,res)=>{
    try{

        const file = await prisma.file.findUnique({where : {id : req.params.id},
                include:{
                    user:true,
                    material:{
                        include:{
                            course:{
                                include:{
                                    department:true,
                                    semester:true
                                }
                            },
                        }
                    },
                    exams:{
                        include:{
                            department:true,
                            semester:true,
                        }
                    },
                    research:{
                        include:{
                            department:true,
                        }
                    }
                }});

        if(!file){
            return res.status(404).json({
                success : false,
                message : "الملف غير موجود"
            });
        }
        
        res.status(200).json({
            success : true,
            message : "تم الرفض  بنجاح",
            data:{
                id:file.id,
                createdAt:file.createdAt,
                type:file.type,
                uploadedBy:file.user.fullname,
                extension:file.extension,
                path:file.path,
                size:file.size,
                status :getOtherDetails(file.type,file)?.status,
                semester:getOtherDetails(file.type,file)?.semester,
                department:getOtherDetails(file.type,file)?.department,
                courseName:getOtherDetails(file.type,file)?.courseName,
                lectureName:getOtherDetails(file.type,file)?.lectureName
            }
        });
        
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

function getOtherDetails(type,file){
    switch(type){
        case 'إمتحان':
                return {
                    title:file.exams.title,
                    department:file.exams.department.title,
                    status:file.exams.status
                }
        case 'ملخص':
            if(file.material)
                return {
                title:file.material.course.name,
                lectureName:file.material.lecture?.title ?? '' ,
                department:file.material.course.department.title,
                status : file.material.status,
                semester : file.material.course.semester.title,
                courseName : file.material.course.name
                }
            break;

        case 'محاضرة':
            if(file.material)
                return  {
                title:file.material.lecture?.title ?? file.material.course?.name ,
                lectureName:file.material.lecture?.title ??'' ,
                department:file.material.course.department.title,
                status : file.material.status,
                semester : file.material.course.semester.title,
                courseName : file.material.course.name
            }
            break;
        case 'بحث':

            return {
                title:file.research.title,
                department:file.research.department.title
            }
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
        console.log('approve  ')
        const file = await prisma.file.findUnique({where : {id : req.params.id},
        include:{
            material:true,
            exams:true,
            research:true
        }});

        if(!file){
            return res.status(404).json({
                success : false,
                message : "الملف غير موجود"
            });
        }
         console.log('approve  ',file)
        switch(file.type){
            case 'إمتحان':
                await prisma.exams.update({where : {id:file.exams.id},data:{status : 'تم التأكيد'}})
                break;
            case 'ملخص':
                await prisma.courseMaterial.update({where : {id:file.material.id},data:{status : 'تم التأكيد'}})
                break;
            case 'محاضرة':
                await prisma.courseMaterial.update({where : {id:file.material.id},data:{status : 'تم التأكيد'}})
                break;

            case 'بحث':
                await prisma.reseach.update({where : {id:file.research.id},data:{status : 'تم التأكيد'}})
                break;
        }

        
        res.status(200).json({
            success : true,
            message : "تمت الموافقة بنجاح",
            data:'تم التأكيد'
        });
        
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

const rejectMaterial = async (req,res)=>{
    try{

        const file = await prisma.file.findUnique({where : {id : req.params.id},
                include:{
                    material:true,
                    exams:true,
                    research:true
                }});

        const status = req.params.status;
        if(!status){
            return res.status(400).json({
                success : false,
                message : "الحالة مطلوبة"
            });
        }
        if(!file){
            return res.status(404).json({
                success : false,
                message : "الملف غير موجود"
            });
        }

        if(status !== 'مرفوض' && status !== 'تم التأكيد'){
            switch(file.type){
                case 'إمتحان':
                        await prisma.exams.update({where : {id:file.exams.id},data:{status : 'مرفوض'}})
                    break;
                case 'ملخص':
                        await prisma.courseMaterial.update({where : {id:file.material.id},data:{status : 'مرفوض'}})
                    break;
                case 'محاضرة':
                        await prisma.courseMaterial.update({where : {id:file.material.id},data:{status : 'مرفوض'}})
                    break;

                case 'بحث':
                    await prisma.reseach.update({where : {id:file.research.id},data:{status : 'مرفوض'}})
                    break;
            }
        }

        res.status(200).json({
            success : true,
            message : "تم الرفض  بنجاح",
            data:'مرفوض'
        });
        
    }catch(error){
        res.status(500).json({
            success : false,
            message : "some thing went wrong!",
            error : error.message
        });
    }
}

module.exports = {uploadFile,getAllowedTypes,approveMaterial,rejectMaterial,getAllFiles,getFile,searchFile,getUserFiles,getUserFileRequests}
