const {prisma} = require('../../configs/prisma');
const {roles}= require('../../utils/roles')
const {pagenation} = require('../core/pagenationService')

const createDoctor = async (req,res)=>{
    try{

        const doctorData = req.body;

        const doctor = await prisma.user.create({
            data : {
                fullname : doctorData.fullname,
                email : doctorData.email,
                phone : doctorData.phone,
                address : doctorData.address,

                doctor : {
                    create : {
                        title : doctorData.title,
                        officeNum : doctorData.officeNum,
                        departmentId : doctorData.departmentId
                    }
                }
            },
            include :{
                doctor :{
                    include :{
                        department : true
                    }
                }
            }
        });

        if(!doctor){
            res.status(400).json({
                success : false,
                message : "خطأ في اضافة المستخدم"
            });
        };

        const role = await prisma.role.findUnique({where : {name : roles.DOCTOR}});

        const userRole = await prisma.usersRole.create({
            data :{
                userId : doctor.id,
                roleId : role.id
            }
        })

        if(!userRole){
            res.status(400).json({
                success : false,
                message : "خطأ في اضافة الدكتور"
            });
        }

        res.status(201).json({
            success : true,
            message : "تمت اضافة الدكتور بنجاح",
            data : {
                id:doctor.doctor.id,
                fullname : doctor.fullname,
                address : doctor.address,
                phone : doctor.phone,
                email : doctor.email,
                officeNum : doctor.doctor.officeNum,
                title : doctor.doctor.title,
                department : doctor.doctor.department,
                userId : doctor.id
            }
        })


    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}


const getAllDoctors = async (req,res)=>{
    try{
        const dataLenght = await prisma.doctor.count();
        const pagenationOptions = pagenation(req.query.page,req.query.limit,dataLenght,req.query.sort)

        const doctors = await prisma.user.findMany({
            skip : pagenationOptions.skip,
            take : pagenationOptions.limit,
            where:{
                roles : {some : {role:{name:roles.DOCTOR}}},
                fullname : req.query.name ? req.query.name : {},
                
            },
            orderBy : {
                fullname :  pagenationOptions.sort
            },
            include : {
                doctor :{
                    include :{
                        department:true
                    }
                },
                roles:true
            }
        })

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : doctors,
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

const getDoctor = async (req,res)=>{
    try{
        const doctor = await prisma.user.findUnique({where : {id:req.params.id},include:{
            doctor : {
                include :{
                    department : true
                }
            }
        }})

        if(!doctor){
            res.status(404).json({
                success : false,
                messsage : "الدكتور غير موجود"
            });
        }

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : doctor
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const updateDoctor = async (req,res)=>{
    try{
        const doctorInfo = req.body

        await findDoctor(req.params.id);

        const doctor = await prisma.user.update({
            where :{id : req.params.id},
            data:{
                fullname : doctorInfo.fullname,
                address : doctorInfo.address,
                phone : doctorInfo.phone,
                email : doctorInfo.email,

                doctor :{
                    update : {
                        title : doctorInfo.title,
                        officeNum : doctorInfo.officeNum,
                        departmentId : doctorInfo.departmentId,
                    }
                    
                }
            },
            include:{
                doctor:{
                    include : {
                        department:true
                    }
                }
            }
        })

        if(!doctor){
            res.status(400).json({
                success : false,
                message : "خطأ في تعديل الدكتور"
            })
        }


        res.status(200).json({
            success : true,
            message : "تم تعديل الدكتور بنجاح",
            data : {
                id:doctor.doctor.id,
                fullname : doctor.fullname,
                address : doctor.address,
                phone : doctor.phone,
                email : doctor.email,
                officeNum : doctor.doctor.officeNum,
                title : doctor.doctor.title,
                department : doctor.doctor.department,
                userId : doctor.id
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

const deleteDoctor = async (req,res)=>{
    try{

        const doctor =  await findStudent(req.params.id);
        await prisma.user.delete({where : {id : doctor.id}});

        res.status(200).json({
            success : true,
            message : "تم حذف الدكتور بنجاح",
            data :doctor
        });


    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}



const createBulkDoctors = async (req,res)=>{
    try{
        const doctorsInfo = req.body;

        await prisma.user.createMany({
            data : [
                doctorsInfo.doctors.map(doctor => ({
                    fullname : doctor.fullname,
                    email : doctor.email,
                    address : doctor.address,
                    phone : doctor.phone,
                    doctor : {
                        create :{
                            title : doctor.title,
                            officeNum : doctor.officeNum,
                            departmentId : doctorsInfo.departmentId,
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



async function findDoctor (id){
    const doctor = await prisma.user.findUnique({where :{id:id}});
    if(!doctor){
        return res.status(404).json({
            success : false,
            message : "الطالب غير موجود"
        });
    }
    return doctor;
}

module.exports = {createDoctor,createBulkDoctors,getAllDoctors,getDoctor,updateDoctor,deleteDoctor};