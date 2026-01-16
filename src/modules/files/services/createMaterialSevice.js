const {prisma} = require('../../../configs/prisma');
const {roles} = require('../../../utils/roles')
const addMaterial = async (user, fileId, targetType,targetId)=>{
    if(targetType === "lecture" ){
        const lecture = await prisma.lecture.findUnique({where : {id:targetId}, select : courseId});

        await prisma.courseMaterial.create({
            data : {
                lectureId : targetId,
                courseId : lecture.courseId,
                uploadedById : user.userId,
                fileId :fileId,
                status : user.roles.map(role=>role?.role.name).includes(roles.STDUENT) ? 'قيد الإنتظار' : 'تم التأكيد'
            }
        })
    }

    if(targetType === "course" ){
        
        try{
            await prisma.courseMaterial.create({
            data :{
                courseId : targetId,
                uploadedById : user.userId,
                fileId :fileId,
                status : user.roles.map(role=>role?.role.name).includes(roles.STDUENT) ? 'قيد الإنتظار' : 'تم التأكيد'
            }
        })
        }catch (error){
            console.log("error",error.message)
        }
    }

    if(targetType === "exam" ){
        await prisma.exam.update({
            where:{id : targetId},
            data :{
                fileId : fileId
            }
        })
    }

    if(targetType === "research" ){
        await prisma.research.update({
            where:{id : targetId},
            data :{
                fileId : fileId
            }
        })
    }
}

module.exports = {addMaterial};
