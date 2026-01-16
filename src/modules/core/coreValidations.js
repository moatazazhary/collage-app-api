
const z = require('zod')

const departmentFormSchema = z.object({
    title : z.string().min(5,{message:"لا يمكن ان يكون الإسم اقل من 5 حروف"}),
});

module.exports = {departmentFormSchema}