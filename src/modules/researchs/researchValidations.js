const z = require('zod');
const {prisma} = require('../../configs/prisma');
const { roles } = require('../../utils/roles');

const formSchema = z.object({
    title : z.string('يجب أن يكون نصاً').min(10,'يجب ألا يقل العنوان عن 10 أحرف'),
    year :z.int('يجب أن يكون رقم').min(1995,'يجب ان لا  تكون السنة قبل 1995'),
    abstract: z.string('يجب أن يكون نصاً').min(100,'يجب ألا يقل المستخلص عن 100 حرف'),
    type : z.string('يجب أن يكون نصاً').min(1,'الحقل مطلوب'),
    departmentId :z.string('يجب أن يكون نصاً').min(1,'الحقل مطلوب'),
    role :z.string('يجب أن يكون نصاً').min(1,'الحقل مطلوب'),
    supervisorId : z.string('يجب أن يكون نصاً').min(1,'الحقل مطلوب').refine(
        async (id)=>{
            const user = await prisma.user.findUnique({where : {id:id},include:{roles:{select : {role:true}}}});
            return user?.roles.map(role=>role?.name).includes(roles.DOCTOR)
        }, { message : "المشرف يجب ان يكون دكتور"}
    ),
    authors : z.array(z.string('يجب أن يكون نصاً').min(1,'يجب اختيار طالب واحد على الأقل'))
});


module.exports = {formSchema};