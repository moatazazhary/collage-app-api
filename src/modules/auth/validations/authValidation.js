const z = require('zod');

const loginSchema = z.object({
    identifier : z.string().min(1,"حقل الدخول مطلوب"),
    password : z.string().min(0,"حقل الدخول مطلوب")
})

const changePasswordSchema = z.object({
    oldPassword : z.string().min(1,{message : "الحقل مطلوب"}),
    newPassword : z.string().min(6,{message : "كلمة المرور لا يمكن ان تكون أقل من 6 خانات"}),
    confirmPassword : z.string().min(1,{message : "الحقل مطلوب"})
}).refine(
    (data) => data.newPassword === data.confirmPassword ,
    {message :"كلمة المرور غير متطابقة"}
).refine(
    (data)=> data.oldPassword !== data.newPassword,
    {message : "لا يمكن ان تكون كلمة المرور الجديدة هي نفسها القديمة"}
)




const sendOtpSchema = z.object({
    identifier : z.string().optional(),
    email : z.string().min(1,"البريد الالكتروني مطلوب")
}).refine((data)=>{
        const emailRegex = /^[a-zA-Z0-9_+-]+@(gmail\.com|outlook\.com|outlook\.sa|hotmail\.com)$/
        return emailRegex.test(data.email);
    },{message : "البريد الإلكتروني غير صحيح"}
)

const verifyOtpSchema = z.object({
    otp : z.number().int().refine(val => val >= 100000 && val <= 999999,{message : "يجب ان يكون ال OTP من 6 خانات"}),
    email : z.string().min(1,"البريد الالكتروني مطلوب")
}).refine((data)=>{
        const emailRegex = /^[a-zA-Z0-9_+-]+@(gmail\.com|outlook\.com|outlook\.sa|hotmail\.com)$/
        return emailRegex.test(data.email);
    },{message : "البريد الإلكتروني غير صحيح"}
)


const resetPasswordSchema = z.object({
    email : z.string().min(1,{message : "الحقل مطلوب"}),
    password : z.string().min(6,{message : "كلمة المرور لا يمكن ان تكون أقل من 6 خانات"}),
    confirmPassword : z.string().min(1,{message : "الحقل مطلوب"})
}).refine((data)=>{
        const emailRegex = /^[a-zA-Z0-9_+-]+@(gmail\.com|outlook\.com|outlook\.sa|hotmail\.com)$/
        return emailRegex.test(data.email);
    },{message : "البريد الإلكتروني غير صحيح"}
).refine(
    (data) => data.password === data.confirmPassword ,
    {message :"كلمة المرور غير متطابقة"}
)



module.exports = {loginSchema ,changePasswordSchema,sendOtpSchema,verifyOtpSchema,resetPasswordSchema }