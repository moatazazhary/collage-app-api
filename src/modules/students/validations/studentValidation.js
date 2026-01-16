const z = require('zod')
const createSchema = z.object({
    fullname : z.string().min(5,{message:"لا يمكن ان يكون الإسم اقل من 5 حروف"}),
    address : z.string().min(3,{message:"لا يمكن ان يكون العنوان أقل من 3 حروف"}),
    phone : z.string().length(10,{message : "رقم الهاتف غير صالح"}).min(5,{message:"لا يمكن ان يكون رقم الهاتف أقل من 5 خانات"}),
    email : z.string().default(""),
    facultyNum : z.string().min(5,{message:"لا يمكن أن يكون الرقم الجامعي أقل من 5 خانات"}),
    password : z.string().default(""),
    semesterNum : z.int().min(1,{message:"السمستر مطلوب"}),
    departmentId : z.string().min(1,{message:"القسم مطلوب"})
});



const bulkCreateSchema = z.object({
    semesterNum : z.int().min(1,{message:"السمستر مطلوب"}),
    departmentId : z.string().min(1,{message:"القسم مطلوب"}),
    students : z.array(z.object({
        fullname : z.string().min(5,{message:"لا يمكن ان يكون الإسم اقل من 5 حروف"}),
        address : z.string().min(3,{message:"لا يمكن ان يكون العنوان أقل من 3 حروف"}),
        phone : z.string().length(10,{message : "رقم الهاتف غير صالح"}).min(5,{message:"لا يمكن ان يكون رقم الهاتف أقل من 5 خانات"}),
        email : z.string().default(""),
        facultyNum : z.string().min(5,{message:"لا يمكن أن يكون الرقم الجامعي أقل من 5 خانات"}),
    })) 
});

module.exports = {createSchema , bulkCreateSchema}