const {prisma} = require('../../configs/prisma');


const createResearch = async (req,res)=>{
    try{

        const researchData = req.body;

        const research = await prisma.research.create({
            data :{
                title : researchData.title,
                year : researchData.year,
                abstract : researchData.abstract,
                type : researchData.type,
                createdById : req.userInfo.userId,
                departmentId : researchData.departmentId,
            }
        })

        if(!research){
            return res.status(400).json({
                success : false,
                message : "لم تتم اضافة البحث"
            })
        }

        await prisma.researchParticipant.createMany({
            data :[
                {
                    userId : researchData.supervisorId,
                    researchId : research.id,
                    role : researchData.role
                },
                ...researchData.authors.map(author=>
                    ({
                        userId : author.id,
                        researchId: research.id,
                        role : author.role

                    }))
            ]
        })

        return res.status(201).json({
            success : true,
            message : "تمت اضافة البحث بنجاح"
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const getAllResearchs = async (req,res)=>{
    try{
        const research = await prisma.research.findMany({include : {
            department : true,
            user : true,
            file : true,
            participants : true
        }});


        res.status(200).json({
            success : true,
            message : 'تم تحميل البيانات بنجاح',
            data : research
        })
        
    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const getResearch = async (req,res)=>{
    try{
        const research = await findResearch(req.params.id)

        res.status(200).json({
            success : false,
            message : 'تم تحميل البيانات بنجاح',
            data : research
        })
        
    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const updateResearch = async (req,res)=>{
    try{
        const researchData = req.body;
        const research = await findResearch(req.params.id);
        
        const updatedResearch = await prisma.research.create({
            data :{
                title : researchData.title,
                year : researchData.year,
                abstract : researchData.abstract,
                type : researchData.type,
                createdById : req.userInfo.userId,
                departmentId : researchData.departmentId,
            }
        })

        if(!research){
            return res.status(404).json({
                success : false,
                message : "البحث غير موجود"
            })
        }

        await prisma.researchParticipant.createMany({
            data :[
                {
                    userId : researchData.supervisorId,
                    researchId : research.id,
                    role : researchData.role
                },
                ...researchData.authors.map(author=>
                    ({
                        userId : author.id,
                        researchId: research.id,
                        role : author.role

                    }))
            ]
        })

        return res.status(200).json({
            success : true,
            message : "تم تعديل البحث بنجاح"
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const deleteResearch = async (req,res)=>{
    try{
        const research = await findResearch(req.params.id);

        await prisma.research.delete({where : {id : research.id}});

        res.status(200).json({
            success : false,
            message : 'تم حذف البحث بنجاح',
            data : research
        })
        
    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}




async function findResearch(id){
    const research = await prisma.research.findUnique({where : {id:id},include : {
        department : true,
        user : true,
        file : true,
        participants : true
    }});

    if(!research){
        return res.status(404).json({
            success : false,
            message : "البحث غير موجود"
        });
    }
    return research;
}


module.exports = {createResearch,getAllResearchs,getResearch,updateResearch,deleteResearch}