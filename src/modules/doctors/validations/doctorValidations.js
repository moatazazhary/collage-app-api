const z = require('zod');

const createSchema = z.object({
    fullname : z.string().min(5,{message:"لا يمكن ان يكون الإسم اقل من 5 حروف"}),
    address : z.string().min(3,{message:"لا يمكن ان يكون العنوان أقل من 3 حروف"}),
    phone : z.string().length(9,{message : "رقم الهاتف غير صالح"}).min(5,{message:"لا يمكن ان يكون رقم الهاتف أقل من 5 خانات"}),
    email : z.string().min(1,{message : "البريد الالكتروني مطلوب"}),
    title : z.string().min(5,{message:"لا يمكن أن تكون الرتبة أقل من 5 خانات"}),
    password : z.string().default(""),
    officeNum : z.int().optional(),
    departmentId : z.string().min(1,{message:"القسم مطلوب"})
}).refine((data)=>{
    const emailRegex = /^[a-zA-Z0-9_+-]+@(gmail\.com|outlook\.com|outlook\.sa|hotmail\.com)$/
    return emailRegex.test(data.email);
},{message : "البريد الإلكتروني غير صحيح"}
)


const bulkCreateSchema = z.object({
    departmentId : z.string().min(1,{message:"القسم مطلوب"}),
    doctors : z.array(z.object({
        fullname : z.string().min(5,{message:"لا يمكن ان يكون الإسم اقل من 5 حروف"}),
        address : z.string().min(3,{message:"لا يمكن ان يكون العنوان أقل من 3 حروف"}),
        phone : z.string().length(10,{message : "رقم الهاتف غير صالح"}).min(5,{message:"لا يمكن ان يكون رقم الهاتف أقل من 5 خانات"}),
        email : z.string().min(1,{message : "البريد الالكتروني مطلوب"}),
        title : z.string().min(5,{message:"لا يمكن أن تكون الرتبة أقل من 5 خانات"}),
        officeNum : z.int().optional(),
    }).refine((data)=>{
        const emailRegex = /^[a-zA-Z0-9_+-]+@(gmail\.com|outlook\.com|outlook\.sa|hotmail\.com)$/
        return emailRegex.test(data.email);
    },{message : "البريد الإلكتروني غير صحيح"})
    )
})

module.exports = {createSchema,bulkCreateSchema}