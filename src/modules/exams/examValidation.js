const z = require('zod');

const formSchema = z.object({
    title : z.string('يجب أن يكون نصاً').min(10,'يجب ألا يقل العنوان عن 10 أحرف'),
    year :z.int('يجب أن يكون رقم').min(2000,'يجب ان لا  تكون السنة قبل 2000'),
    departmentId :z.string('يجب أن يكون نصاً').min(1,'الحقل مطلوب'),
    courseId :z.string('يجب أن يكون نصاً').min(1,'الحقل مطلوب'),
    semesterNum : z.int('يجب أن يكون رقماً').min(1,'الحقل مطلوب')
});


module.exports = {formSchema}