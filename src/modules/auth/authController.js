const {prisma} = require('../../configs/prisma')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { roles } = require('../../utils/roles');
const { sendOTPMail } = require('./services/sendMailService');
const {generateOtp, checkLimit} = require('./services/otpService')
const cookieParser = require('cookie-parser')

const login = async (req,res)=>{
    try{

        const {identifier,password} = req.body;
        let user;

        if(identifier.includes("@")){
            user = await prisma.user.findUnique({
                where : {email : identifier},
                include : {
                    roles : {
                        select : {
                            role : true
                        }
                    }
                }
            });
            if(!user){
                res.status(401).json({
                    success : false,
                    message : "خطأ في البريد الإلكتروني أو كلمة المرور"
                })
            }

            if(!user.isChangePassword){
                res.status(200).json({
                    success : true,
                    firstLogin : true,
                    userType : "doctor",
                    email : user.email,
                    identifier : null
                })
            }

            const validPassword = await bcrypt.compare(password,user.password);
            if(!validPassword){
                res.status(401).json({
                    success : false,
                    message : "خطأ في البريد الإلكتروني أو كلمة المرور"
                })
            }
        }else{
            const student = await prisma.student.findUnique({where : {facultyNum : identifier}});
            if(!student){
                res.status(401).json({
                    success : false,
                    message : "خطأ في الرقم الجامعي أو كلمة المرور"
                })
            }

            user = await prisma.user.findUnique({
                where : {id : student.userId},
                include : {
                    roles : {
                        select : {
                            role : true
                        }
                    }
                }
            });

            if(!user.isChangePassword){
                res.status(200).json({
                    success : true,
                    firstLogin : true,
                    userType : "student",
                    email : null,
                    identifier : identifier
                })
            }

            if(user){
                const validPassword = await bcrypt.compare(password,user.password);
                if(!validPassword){
                    res.status(401).json({
                        success : false,
                        message : "خطأ في الرقم الجامعي أو كلمة المرور"
                    })
                }
            }
        }  

        const token = jwt.sign({
            userId:user.id,
            identifier : identifier,
            email:user.email,
            fullname : user.fullname,
            address:user.address,
            phone:user.phone,
            roles : user.roles

        },process.env.JWT_PRIVATE_KEY,{expiresIn:'30m'});

        res.cookie('auth_token',token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:30*60*1000,
            path:'/'
        });
        res.status(200).json({
            success : true,
            message : "تم تسجيل الدخول بنجاح",
            firstLogin : false
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const logout = async (req,res)=>{
    try{

        res.clearCookie('auth_token',{
            httpOnly:true,
            secure:true,
            sameSite:"none"
        });

        res.status(200).json({
            success : true,
            message : 'تم تسجيل الخروج بنجاح'
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const getUserInfo = async (req,res)=>{
    try{

        let user ;
        if(req.userInfo.roles.map(role=>role.role.name).includes(roles.ADMIN)){
            user = await prisma.user.findUnique({where:{id:req.userInfo.userId}})
        }else if(req.userInfo.roles.map(role=>role.role.name).includes(roles.DOCTOR)){
            user = await prisma.user.findUnique({where:{id:req.userInfo.userId},include:{doctor : true}})
        }else if(req.userInfo.roles.map(role=>role.role.name).includes(roles.STDUENT)){
            user = await prisma.user.findUnique({where:{id:req.userInfo.userId},include:{student : true}})
        }

        if(!user){
            res.status(404).json({
                success : false,
                message : "المستخدم غير موجود"
            });
        }

        res.status(200).json({
            success : true,
            message : "تم تحميل البيانات بنجاح",
            data : user
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}

const chanegPassword = async (req,res)=>{
    try{

        const {oldPassword,newPassword,confirmPassword} = req.body;
        const userId = req.userInfo.userId;
        const user = await prisma.user.findUnique({where : {id:userId}});

        if(!user){
            res.status(404).json({
                success : false,
                message : "المستخدم غير موجود"
            });
        }

        const CheckPassword = await bcrypt.compare(oldPassword,user.password);

        if(!CheckPassword){
            return res.status(401).json({
                success : false,
                message : "خطأ في كلمة المرور"
            });
        }else{
            const newHashedPassword = await bcrypt.hash(newPassword,10);
            await prisma.user.update({where : {id : user.id},data : {password : newHashedPassword}});
        }

 
        res.status(200).json({
            success : true,
            message : "تم تغيير كلمة المرور بنجاح"
        })


    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}


const sendOTP = async (req,res)=>{
    try{
        const userData = req.body
        let user;
        console.log('ide : ',userData)
        if(userData.identifier){
            const student = await prisma.student.findUnique({where :{facultyNum : userData.identifier}})
            if(!student){
                return res.status(404).json({
                    success : false,
                    message : "الطالب غير موجود"
                });
            }

            user = await prisma.user.findUnique({where : {id : student.userId}})
        }else{
            user = await prisma.user.findUnique({where : {email : userData.email}})
            if(!user){
                return res.status(404).json({
                    success : false,
                    message : "الدكتور غير موجود"
                });
            }
        }

        const todayDate = new Date().toISOString().split('T')[0];
        const lastDay = user.otpExpire && user.otpExpire !== null ? user.otpExpire.toISOString().split('T')[0] : null

        if(todayDate !== lastDay){
            user.otpExpire = null;
            user.otpLimit = 0
        }

        const checkLimiation = checkLimit(user.otpExpire,user.otpLimit);

        if(!checkLimiation.status){
            return res.status(400).json({
                success : false,
                message : checkLimiation.message
            });
        };

        const {otp,expireDate} = generateOtp();
        const hashedOtp = await bcrypt.hash(otp,10);

        await prisma.user.update({where : {id:user.id},data :{email:userData.email,otp : hashedOtp,otpExpire:expireDate,otpLimit : user.otpLimit + 1}})
        res.status(200).json({
            success : true,
            message : "تم ارسال رمز ال OTP",
            email : userData.email
        })
        sendOTPMail(userData.email,user.fullname,5,"رمز تعيين كلمة المرور",otp).catch((err)=>{
            console.error('Error while sending email...',err);
        });


    }catch (error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}


const verifyOtp = async (req,res)=>{
    try{
        const optData = req.body
        const user = await prisma.user.findUnique({where : {email : optData.email}});

        if(!user){
            res.status(404).json({
                success : false,
                message : "المستخدم غير موجود"
            });
        }

        const otpCheck = await bcrypt.compare(optData.otp.toString(),user.otp)
        if(!otpCheck){
            res.status(400).json({
                success : false,
                message : "الرمز خاطئ"
            });
        }

        if(user.expiresIn < new Date()){
            res.status(400).json({
                success : false,
                message : "انتهت صلاحية الرمز"
            });
        }

        res.status(200).json({
            success : true,
            message : "تم التأكيد",
            email : user.email
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}


const resetPassword = async (req,res)=>{
    try{

        const dataInfo = req.body;
        const user = await prisma.user.findUnique({where : {email : dataInfo.email}})

        if(!user){
            res.status(404).json({
                success : false,
                message : "المستخدم غير موجود"
            });
        }

        const password = await bcrypt.hash(dataInfo.password,10);

        await prisma.user.update({
            where : {id : user.id},
            data : {
                password : password,
                otp : '',
                otpExpire : null,
                isChangePassword : true
            }
        });

        res.status(200).json({
            success : true,
            message : "تمت إعادة تعيين كلمة المرور بنجاح"
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}



// chack if user is logged in or not
const me = async (req,res)=>{
    try{

        const token = req.cookies?.auth_token;

        if(!token){
            return res.status(401).json({
                authenticated : false
            });
        }

        const user = jwt.verify(token,process.env.JWT_PRIVATE_KEY);


        return res.status(200).json({
                authenticated : true,
                data : user
            });

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}


// fot test only - will be removed
const forgetPassword = async (req,res)=>{
    try{

        const data = req.body;
        const user  = await prisma.user.findUnique({where : {email : data.email}});

        if(!user){
            res.status(404).json({
                success : false,
                message : "المستخدم غير موجود"
            })
        }

        user.password = await bcrypt.hash(data.password,10);
        await prisma.user.update({where :{id:user.id}, data :{password:user.password}});

        res.status(200).json({
            success : false,
            message : "تم تغيير كلمة المرور بنجاح"
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message : 'something went wrong !',
            error : error.message
        })
    }
}


module.exports = {login,logout,chanegPassword,forgetPassword,getUserInfo,sendOTP,verifyOtp,resetPassword,me}
