const {prisma} = require('../../configs/prisma');

const requestDegree = async (req,res)=>{
    try{

        const requestData = req.body;
        const files = req.files;

        const degreeTypes = await prisma.degreeType.findMany({where : {id : {in : requestData.degreeTypeIds}}});

        const bank = await prisma.bank.findUnique({where : {id : requestData.bankId}});


        if(degreeTypes.length == 0){
            res.status(400).json({
                success : false,
                message : "نوع الشهادة غير رفق"
            });
        }

        if(!bank && !files['paymentPhoto']){
            res.status(400).json({
                success : false,
                message : "بيانات الدفع غير صحيحة"
            });
        }

        if(!files['personalPhoto'] && !files['idCardPhoto']){
            res.status(400).json({
                success : false,
                message : "الصور لم ترفع "
            });
        }

        const degreeRequest = await prisma.degreeRequest.create({
            data : {
                fullnameEnglish : requestData.fullnameEnglish,
                personalPhoto : files['personalPhoto'][0].path ,
                personalPhoto2 : files['personalPhoto2'] ? files['personalPhoto'][0].path : null ,
                idCardPhoto : files['idCardPhoto'][0].path,
                paymentPhoto : files['paymentPhoto'][0].path,
                bankId : requestData.bankId ,
                userId : requestData.userId
            },
            include : {
                bank : true,
                user : {
                    include : {
                        student : true
                    }
                }
            }
        })

        if(!degreeRequest){
            res.status(400).json({
                success : false,
                message : "حدث خطأ في التقديم"
            });
        }

        await prisma.degreeRequestType.createMany({
            data : [
                degreeTypes.map(type=>({
                    degreeRequestId :degreeRequest.id ,
                    degreeTypeId :type.id 
                }))
            ]
        })

        res.status(201).json({
            success : true,
            message : "تم التقديم بنجاح",
            data : degreeRequest
        });


    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const getAllRequests = async (req,res)=>{
    try{

        const degreeRequests = await prisma.degreeRequest.findMany({include : {user:{include : {student:true}},bank:true,degreeTypes:true}});

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : degreeRequests
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const getDegreeRequest = async (req,res)=>{
    try{

        const degreeRequest = await prisma.degreeRequest.findUnique({where : {id:req.params.id},include : {user:{include : {student:true}},bank:true}});
        if(!degreeRequest){
            return res.status(404).json({
                success : false,
                message : "الطلب غير موجود"
            });
        }

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : degreeRequest
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const openRequest = async (req,res)=>{
    try{

        const degreeRequest = await findDegreeRequest(req.params.id)

        if(degreeRequest.status === 'قيد الإنتظار'){
            await prisma.degreeRequest.update({where : {id:req.params.id},data :{status : "قيد المراجعة"}});
        }
        
        res.status(200).json({
            success : true,
            message : "تم فتح الطلب بنجاح"
        });

    }catch (error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}
const approveRequest = async (req,res)=>{
    try{

        await findDegreeRequest(req.params.id);

        await prisma.degreeRequest.update({where : {id:req.params.id},data :{status : "مكتمل",notes : req.body.notes}});

        res.status(200).json({
            success : true,
            message : "تم قبول الطلب بنجاح"
        });

    }catch (error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}
const rejectRequest =async  (req,res)=>{
    try{

        await findDegreeRequest(req.params.id);

        await prisma.degreeRequest.update({where : {id:req.params.id},data :{status : "مرفوض",notes:req.params.notes}});

        res.status(200).json({
            success : true,
            message : "تم رفض الطلب"
        });

    }catch (error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}


const degreeTypes = async (req,res)=>{
    try{

        const types = await prisma.degreeType.findMany();
        
        res.status(200).json({
            success : true,
            message : 'تم تحميل البيانات بنجاح',
            data : types
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const banks = async (req,res)=>{
    try{

        const banks = await prisma.bank.findMany();
        res.status(200).json({
            success : true,
            message : 'تم تحميل البيانات بنجاح',
            data : banks
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}


async function findDegreeRequest (id){
    const degreeRequest =  await prisma.degreeRequest.findUnique({where :{id:id}});

    if(!degreeRequest){
        return res.status(404).json({
            success : false,
            message : "الطلب غير موجود"
        });
    }

    return degreeRequest;
}



module.exports = {requestDegree,openRequest,approveRequest,rejectRequest,getAllRequests,degreeTypes,banks,getDegreeRequest}