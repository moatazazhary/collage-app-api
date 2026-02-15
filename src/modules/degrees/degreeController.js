const path = require('path');
const {prisma} = require('../../configs/prisma');
const { pagenation } = require('../core/pagenationService');

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
                personalPhoto : path.relative(process.env.UPLOADS_DIR , files['personalPhoto'][0].path).replace('/\\/g',
                    '/'),
                personalPhoto2 : files['personalPhoto2'] ? path.relative(process.env.UPLOAD_DIR , files['personalPhoto2'][0].path).replace('/\\/g',
                    '/') : null ,
                idCardPhoto : path.relative(process.env.UPLOADS_DIR , files['idCardPhoto'][0].path).replace('/\\/g',
                    '/'),
                paymentPhoto : path.relative(process.env.UPLOADS_DIR , files['paymentPhoto'][0].path).replace('/\\/g',
                    '/'),
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


        const degreeType = await prisma.degreeRequestType.createMany({
            data : degreeTypes.map(type=>({
                    degreeRequestId :degreeRequest.id,
                    degreeTypeId :type.id 
                }))        
        })


        res.status(201).json({
            success : true,
            message : "تم التقديم بنجاح"
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


        const dataLenght = await prisma.degreeRequest.count();
        const pagenationOptions = pagenation(req.query.page,req.query.limit,dataLenght,req.query.sort)

        const degreeRequests = await prisma.degreeRequest.findMany({
            skip : pagenationOptions.skip,
            take : pagenationOptions.limit,
            orderBy : {
                createdAt :pagenationOptions.sort
            },
            include : {user:{include : {student:true}},bank:true,degreeTypes:{
                include:{
                    degreeTypes:true
                }
            }}});

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : degreeRequests.map(request=>
                ({
                    id:request.id,
                    fullnameEnglish:request.fullnameEnglish,
                    fullnameArabic:request.user.fullname,
                    personalPhoto:path.relative(process.env.UPLOADS_DIR , request.personalPhoto).replace('/\\/g',
                    '/'),
                    idCardPhoto:path.relative(process.env.UPLOADS_DIR , request.idCardPhoto).replace('/\\/g',
                    '/'),
                    status:request.status,
                    createdAt:request.createdAt,
                    paymentPhoto:path.relative(process.env.UPLOADS_DIR , request.paymentPhoto).replace('/\\/g',
                    '/'),
                    bank:request.bank.bankName,
                    degreeTypes:request.degreeTypes.map(degree=>degree.degreeTypes?.title)
                }
            )),
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

const getUserDegreeRequests = async (req,res)=>{
    try{
        // const dataLenght = await prisma.degreeRequest.count();
        // const pagenationOptions = pagenation(req.query.page,req.query.limit,dataLenght,req.query.sort)
        const user = req.userInfo;
        console.log('user ',user)
        const degreeRequests = await prisma.degreeRequest.findMany({where:{
            userId:user.userId
        }});

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : degreeRequests.map(request=>
                ({
                    id:request.id,
                    status:request.status,
                    createdAt:request.createdAt,
                    notes:request.notes
                }
            ))
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

        const degreeRequest = await prisma.degreeRequest.findUnique({where : {id:req.params.id},
            include : {user:{include : {student:true}},bank:true,degreeTypes:{
                include:{
                    degreeTypes:true
                }
            }}});

        if(!degreeRequest){
            return res.status(404).json({
                success : false,
                message : "الطلب غير موجود"
            });
        }


        let totalPrice = 0;
        degreeRequest.degreeTypes.map(degree=> totalPrice += parseInt(degree.degreeTypes?.price))


        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : {
                    id:degreeRequest.id,
                    fullnameEnglish:degreeRequest.fullnameEnglish,
                    fullnameArabic:degreeRequest.user.fullname,
                    // personalPhoto:path.relative(process.env.UPLOADS_DIR , degreeRequest.personalPhoto).replace('/\\/g',
                    // '/'),
                    // idCardPhoto:path.relative(process.env.UPLOADS_DIR , degreeRequest.idCardPhoto).replace('/\\/g',
                    // '/'),

                    personalPhoto:degreeRequest.personalPhoto,
                    idCardPhoto: degreeRequest.idCardPhoto,
                    status:degreeRequest.status,
                    createdAt:degreeRequest.createdAt,
                    // paymentPhoto:path.relative(process.env.UPLOADS_DIR , degreeRequest.paymentPhoto).replace('/\\/g',
                    // '/'),
                    paymentPhoto:degreeRequest.paymentPhoto,
                    bank:degreeRequest.bank.bankName,
                    accountNumber:degreeRequest.bank.accountNumber,
                    notes:degreeRequest.notes,
                    degreeTypes:degreeRequest.degreeTypes.map(degree=>degree.degreeTypes?.title),
                    totalPrice
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

const openRequest = async (req,res)=>{
    try{

        const degreeRequest = await findDegreeRequest(req.params.id)

        if(degreeRequest.status === 'قيد الإنتظار'){
            await prisma.degreeRequest.update({where : {id:req.params.id},data :{status : "قيد المراجعة"}});
        }
        
        res.status(200).json({
            success : true,
            message : "تم فتح الطلب بنجاح",
            data:"قيد المراجعة"
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

        const degreeRequest = await findDegreeRequest(req.params.id);

        if(degreeRequest.status !== "قيد المراجعة"){
            res.status(200).json({
                success : true,
                message : "لا يمكن قبول الطلب",
            });
        }
        const updatedDegreeRequest = await prisma.degreeRequest.update({where : {id:req.params.id},data :{status : "مكتمل",notes : req.body.notes}});

        res.status(200).json({
            success : true,
            message : "تم قبول الطلب بنجاح",
            data:{
                status:updatedDegreeRequest.status,
                notes:updatedDegreeRequest.notes
            }
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

        const degreeRequest = await findDegreeRequest(req.params.id);

        if(degreeRequest.status === "مرفوض" || degreeRequest.status === "مكتمل"){
            res.status(200).json({
                success : true,
                message : "لا يمكن رفض هذا الطلب"
            });
        }
        const updatedDegreeRequest = await prisma.degreeRequest.update({where : {id:req.params.id},data :{status : "مرفوض",notes:req.body.notes}});

        res.status(200).json({
            success : true,
            message : "تم رفض الطلب",
            data:{
                status:updatedDegreeRequest.status,
                notes:updatedDegreeRequest.notes
            }
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



module.exports = {requestDegree,openRequest,approveRequest,rejectRequest,getAllRequests,degreeTypes,banks,getDegreeRequest,getUserDegreeRequests}