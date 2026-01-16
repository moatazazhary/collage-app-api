
const { prisma } = require("../../configs/prisma");
const {roles} = require('../../utils/roles');
const { pagenation } = require("../core/pagenationService");


const createStudent = async (req,res)=>{
    try{
        const studentInfo = req.body

        const newStudent = await prisma.user.create({
            data:{
                fullname : studentInfo.fullname,
                address : studentInfo.address,
                phone : studentInfo.phone,
                email : studentInfo.email,

                student :{
                    create : {
                        facultyNum : studentInfo.facultyNum,
                        semesterNum : studentInfo.semesterNum,
                        departmentId : studentInfo.departmentId,
                    }
                    
                }
            },
            include:{
                student:{
                    include : {
                        department:true,
                        semester : true
                    }
                }
            }
        })

        if(!newStudent){
            res.status(400).json({
                success : false,
                message : "خطأ في اضافة الطالب"
            })
        }

        const role = await prisma.role.findUnique({
            where:{name :roles.STDUENT}
        });

        await prisma.usersRole.create({
            data:{
                userId:newStudent.id,
                roleId:role.id
            }
        });


        res.status(201).json({
            success : true,
            message : "تمت اضافة الطالب بنجاح",
            data : {
                id:newStudent.student.id,
                fullname : newStudent.fullname,
                address : newStudent.address,
                phone : newStudent.phone,
                email : newStudent.email,
                facultyNum : newStudent.student.facutlyNum,
                semester : newStudent.student.semester,
                department : newStudent.student.department,
                userId : newStudent.id
            }
        });



    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}


const getAllStudents = async (req,res)=>{
    try{

        const dataLenght = await prisma.student.count();
        const pagenationOptions = pagenation(req.query.page,req.query.limit,dataLenght,req.query.sort)

        const students = await prisma.user.findMany({
            skip : pagenationOptions.skip,
            take : pagenationOptions.skip,
            where:{
                roles : {some:{role:{name:roles.STDUENT}}},
                fullname : req.query.name ? req.query.name :'',
                student : {
                    facultyNum : req.query.facultyNum ? req.query.facultyNum : ''
                }
            },
            orderBy : {
                fullname :pagenationOptions.sort
            },
            include :{
                student:{
                    include : {department:true,semester:true}},roles:true}})

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : students,
            totalData : dataLenght,
            currentPage : pagenationOptions.page,
            totalPages : pagenationOptions.totalPages

        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const getStudent = async (req,res)=>{
    try{
        const student = await prisma.user.findUnique({where : {id:req.params.id},select:{
            student : {
                select :{
                    department : true,
                    semester : true
                }
            }
        }})

        if(!student){
            res.status(404).json({
                success : false,
                messsage : "الطالب غير موجود"
            });
        }

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : student
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const updateStudent = async (req,res)=>{
    try{
        const studentInfo = req.body

        await findStudent(req.params.id);

        const student = await prisma.user.update({
            where :{id : req.params.id},
            data:{
                fullname : studentInfo.fullname,
                address : studentInfo.address,
                phone : studentInfo.phone,
                email : studentInfo.email,

                student :{
                    update : {
                        facultyNum : studentInfo.facultyNum,
                        semesterNum : studentInfo.semesterNum,
                        departmentId : studentInfo.departmentId,
                    }
                    
                }
            },
            include:{
                student:{
                    include : {
                        department:true,
                        semester : true
                    }
                }
            }
        })

        if(!student){
            res.status(400).json({
                success : false,
                message : "خطأ في تعديل الطالب"
            })
        }


        res.status(200).json({
            success : true,
            message : "تم تعديل الطالب بنجاح",
            data : {
                id:student.student.id,
                fullname : student.fullname,
                address : student.address,
                phone : student.phone,
                email : student.email,
                facultyNum : student.student.facutlyNum,
                semester : student.student.semester,
                department : student.student.department,
                userId : student.id
            }
        });



    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const deleteStudent = async (req,res)=>{
    try{

        const student =  await findStudent(req.params.id);
        await prisma.user.delete({where : {id : student.id}});

        res.status(200).json({
            success : true,
            message : "تم حذف الطالب بنجاح",
            data :student
        });



    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}



const createBulkStudents = async (req,res)=>{
    try{
        const studentsInfo = req.body;

        await prisma.user.createMany({
            data : [
                studentsInfo.students.map(student => ({
                    fullname : student.fullname,
                    email : student.email,
                    address : student.address,
                    phone : student.phone,
                    student : {
                        create :{
                            facultyNum : student.facultyNum,
                            semesterNum : studentsInfo.semesterNum,
                            departmentId : studentsInfo.departmentId,
                        }
                    }
                }))
            ]
        });

        res.status(201).json({
            success : true,
            message : "تمت اضافة البيانات بنجاح"
        });
    }catch (error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
};

const getStudentDegreeRequests = async (req,res)=>{
    try{

        const studentDegreeRequests = await prisma.user.findMany({where:{id:req.userInfo.userId},include:{degreeRequests : true},select :{degreeRequests:true}})
        
        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : studentDegreeRequests
        });


    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}


async function findStudent (id){
    const student = await prisma.user.findUnique({where :{id:id}});
    if(!student){
        return res.status(404).json({
            success : false,
            message : "الطالب غير موجود"
        });
    }
    return student;
}

module.exports = {createStudent,getStudentDegreeRequests,createBulkStudents,getAllStudents,getStudent,deleteStudent,updateStudent};