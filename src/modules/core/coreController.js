const {prisma} = require('../../configs/prisma')

// department 
const getAllDepartments = async(req,res)=>{
    try{

        const departments = await prisma.department.findMany({include:{students:true,doctors:true}});
        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : departments
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}
const getDepartment = async(req,res)=>{
    try{

        const department = await prisma.department.findUnique({where:{id : req.params.id}});
        if(!department){
            res.status(404).json({
                success : false,
                message : "القسم غير موجود"
            });
        }

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : department
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const createDepartment = async (req,res)=>{
    try{

        const department = await prisma.department.create({data:{title : req.body.title}});
        if(!department){
            res.status(400).json({
                success : false,
                message : "خطأ في إضافة القسم"
            });
        }

        res.status(201).json({
            success : true,
            message : "تمت إضافةالقسم بنجاح",
            data : department
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const updateDepartment = async (req,res)=>{
    try{
        const department = await prisma.department.findUnique({where:{id : req.params.id}});
        if(!department){
            res.status(404).json({
                success : false,
                message : "القسم غير موجود"
            });
        }

        await prisma.department.update({where : {id:department.id},data:{title : req.body.title}});


        res.status(200).json({
            success : true,
            message : "نم تعديل القسم بنجاح",
            data : department
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const deleteDepartment = async (req,res)=>{
    try{
        const department = await prisma.department.findUnique({where:{id : req.params.id}});
        if(!department){
            res.status(404).json({
                success : false,
                message : "القسم غير موجود"
            });
        }

        await prisma.department.delete({where : {id:department.id}});

        res.status(200).json({
            success : true,
            message : "نم حذف القسم بنجاح"
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}



// semester 
const getAllSemesters = async(req,res)=>{
    try{

        const semesters = await prisma.semester.findMany({include:{students:true}});
        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : semesters
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}
const getSemester = async(req,res)=>{
    try{

        const semester = await prisma.semester.findUnique({where:{id : req.params.id}});
        if(!semester){
            res.status(404).json({
                success : false,
                message : "السمستر غير موجود"
            });
        }

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : semester
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}



module.exports = {getAllDepartments,getDepartment,createDepartment,updateDepartment,deleteDepartment,getAllSemesters,getSemester}