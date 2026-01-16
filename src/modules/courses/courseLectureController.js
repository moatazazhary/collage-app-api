const { date, includes } = require('zod');
const {prisma} = require('../../configs/prisma')



const getAllCuorses = async (req,res)=>{
    try{
        const courses = await prisma.course.findMany({include : {
            department : true,
            semester : true,
            doctors : true,
            lectures : true,
            materials : true,
            exams : true
        }});

        res.status(200).json({
            success : true,
            message : "تم بنجاح",
            data : courses
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const getCourse = async (req,res)=>{
    try{
        const course = await prisma.course.findUnique({where :{id:req.params.id},
        include : {
            department : true,
            semester : true,
            doctors : true,
            lectures : true,
            materials : true
        }});

        if(!course){
            res.status(404).json({
                success : false,
                message : "الكورس غير موجود"
            })
        }

        res.status(200).json({
            success : false,
            message : "تم بنجاح",
            data : course
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const createCourse = async (req,res)=>{
    try{

        const couresInfo = req.body;
        const department = await prisma.department.findUnique({where : {id:couresInfo.departmentId}})
        const doctor = await prisma.user.findUnique({where : {id:couresInfo.doctorId}})
        const semester = await prisma.semester.findUnique({where : {semesterNum:couresInfo.semesterNum}})

        if(!semester){
            res.status(404).json({
                success : false,
                message : "السمستر المدخل غير موجود"
            })
        }
        if(!department){
            res.status(404).json({
                success : false,
                message : "القسم المدخل غير موجود"
            })
        }
        const course = await prisma.course.create({
            data : {
                name : couresInfo.name,
                description : couresInfo.description,
                departmentId : couresInfo.departmentId,
                semesterNum : couresInfo.semesterNum
            },
            include : {
                department : true,
                semester : true
            }
        })

        if(!course){
            res.status(400).json({
                success : false,
                message : "خطأ في اضافة الكورس"
            })
        }

        if(couresInfo.doctorId){
            if(!doctor){
            res.status(404).json({
                success : false,
                message : "الدكتور المدخل غير موجود"
            })
        }
            await prisma.doctorCourse.create({
                data : {
                    userId : couresInfo.doctorId,
                    courseId : course.id,
                    isCurrent : couresInfo.isDoctorCurrent
                }
            })
        }

        res.status(201).json({
            success : true,
            message : "تمت اضافة الكورس بنجاح",
            data : course
        })


        
    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const updateCourse = async (req,res)=>{
    try{

        const couresInfo = req.body;
        const semester = await prisma.semester.findUnique({where : {semesterNum:couresInfo.semesterNum}})
        let course = await prisma.course.findUnique({where : {id:req.params.id}})
        
        if(!course){
            res.status(404).json({
                success : false,
                message : "الكورس غير موجود"
            })
        }

        if(!semester){
            res.status(404).json({
                success : false,
                message : "السمستر المدخل غير موجود"
            })
        }
        
        course = await prisma.course.update({
            data : {
                name : couresInfo.name,
                description : couresInfo.description,
                departmentId : couresInfo.departmentId,
                semesterNum : couresInfo.semesterNum
            },where :{id:course.id},
            include : {
                department : true,
                semester : true,
                doctors : true
            }
        })


        res.status(200).json({
            success : true,
            message : "تم تعديل الكورس بنجاح",
            data : course
        })


        
    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const deleteCourse = async (req,res)=>{
    try{

        const course = await prisma.course.findUnique({where : {id: req.params.id}});

        if(!course){
            res.status(404).json({
                success :false,
                message : "الكورس غير موجود"
            })
        }

        await prisma.course.delete({where :{id:course.id}});
        
        res.status(200).json({
            success : false,
            message : "تم حذف الكورس بنجاح"
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const addDoctorToCourse = async (req,res)=>{
    try{

        const doctor = await prisma.user.findUnique({where :{id : req.body.doctorId}})
        const course = await prisma.course.findUnique({where : {id: req.body.courseId}})

        if(!doctor){
            res.status(404).json({
                success : false,
                message : "الدكتور غير موجود"
            })
        }

        if(!course){
            res.status(404).json({
                success : false,
                message : "الكورس غير موجود"
            })
        }

        const doctorCourse = await prisma.doctorCourse.create({
            data : {
                userId : doctor.id,
                courseId : course.id,
                isCurrent : req.body.isDoctorCurrent
            }
        });

        if(!doctorCourse){
            res.status(400).json({
                success : false,
                message : "خطأ في اضافة الدكتور للكورس"
            })
        }

        res.status(200).json({
            success : true,
            message : "تمت اضافة الدكتور للكورس بنجاح"
        })


    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}


const getAllLectures = async (req,res)=>{
    try{
        const lectures = await prisma.lecture.findMany({include : {
            course : true,
            user : true
        }});

        res.status(200).json({
            success : true,
            message : "تم بنجاح",
            data : lectures
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const getLecture = async (req,res)=>{
    try{
        const lecture = await prisma.lecture.findUnique({where :{id:req.params.id},
        include : {
            course : true,
            user : true
        }});

        if(!lecture){
            res.status(404).json({
                success : false,
                message : "الدرس غير موجود"
            })
        }

        res.status(200).json({
            success : false,
            message : "تم بنجاح",
            data : lecture
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}
const createLecture = async (req,res)=>{
    try{

        const lectureInfo = req.body;

        const course = await prisma.course.findUnique({where:{id:lectureInfo.courseId}});

        if(!course){
            res.status(404).json({
                success : false,
                message : "الكورس غير موجود"
            })
        }


        const lecture = await prisma.lecture.create({
            data :{
                courseId : course.id,
                CreatedById : req.userInfo.userId,
                title : lectureInfo.title
            }
        })

        if(!lecture){
            res.status(400).json({
                success : false,
                message : "خطأ في اضافة الدرس"
            })
        }


        res.status(201).json({
            success : true,
            message : "تمت اضافة الكورس بنجاح",
            data : lecture
        })


        
    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}



const updateLecture = async (req,res)=>{
    try{
        const lectureInfo = req.body;
        let lecture = await prisma.lecture.findUnique({where : {id:req.params.id}});

        if(!lecture){
            res.status(404).json({
                success : false,
                message : "المحاضرة غير موجودة"
            });
        }

        lecture = await prisma.lecture.update({
            data:{
                title : lectureInfo.title
            },
            where :{id:lecture.id}
        })

        res.status(200).json({
            success : false,
            message : "تم تعديل المحاضرة بنجاح"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const deleteLecture = async (req,res)=>{
    try{
        const lecture = await prisma.lecture.findUnique({where :{id: req.params.id}});
        if(!lecture){
            res.status(404).json({
                success : false,
                message : "المحاضرة غير موجودة"
            });
        };

        await prisma.lecture.delete({where : {id:lecture.id}});
        
        res.status(200).json({
            success : false,
            message : "تم حذف المحاضرة بنجاح"
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}



module.exports = {createCourse,getAllCuorses,getCourse,updateCourse,deleteCourse,addDoctorToCourse,createLecture,getAllLectures,getLecture,updateLecture,deleteLecture}