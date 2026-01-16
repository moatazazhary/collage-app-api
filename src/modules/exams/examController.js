const {prisma} = require('../../configs/prisma');
const { roles } = require('../../utils/roles');


const createExam = async (req,res)=>{
    try{
        const examInfo = req.body

        const exam = await prisma.exam.create({
            data :{
                title : examInfo.title,
                year : examInfo.year,
                status : req.userInfo.roles?.map(role => role.role.name).includes(roles.STDUENT) ? 'قيد المراجعة' : 'تم التأكيد',
                departmentId : examInfo.departmentId,
                semesterNum : examInfo.semesterNum,
                courseId : examInfo.courseId,
                uploadedById : req.userInfo.userId
            }
        });

        if(!exam){
            res.status(400).json({
                success : false,
                message : 'خطأ في اضافة الإمتحان'
            });
        }

        res.status(201).json({
            success : true,
            message : 'تمت اضافة الإمتحان بنجاح'
        });


    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
};

const getAllExams = async (req,res)=>{
    try{

        const exams = await prisma.exam.findMany({include :{
            semester : true,
            department : true ,
            user : true,
            course : true,
            file : true
            }});

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : exams
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
};

const getExam = async (req,res)=>{
    try{

        const exam = await findExam(req.params.id);
        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : exam
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const updateExam = async (req,res)=>{
    try{

        const exam = await findExam(req.params.id);

        await prisma.exam.update({
            where : {id:exam.id},
            data :{
                title : examInfo.title,
                year : examInfo.year,
                departmentId : examInfo.departmentId,
                semesterNum : examInfo.semesterNum,
                courseId : examInfo.courseId
            }
        });


        res.status(200).json({
            success : true,
            message : "تم تعديل الامتحان بنجاح"
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const deleteExam = async (req,res)=>{
    try{
        const exam  = findExam(req.params.id);

        await prisma.exam.delete({where : {id:exam.id}});

        res.status(200).json({
            success : true,
            message : "تم حذف الامتحان بنجاح"
        })

    }catch (error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

async function findExam(id) {
    const exam = await prisma.exam.findUnique({where : {id:id},include :{
            semester : true,
            department : true ,
            user : true,
            course : true,
            file : true
    }});

    if(!exam){
        return res.status(404).json({
            success : false,
            message : "الامتحان غير موجود"
        });
    }

    return exam;
}



module.exports = {createExam,getAllExams,deleteExam,updateExam,getExam}