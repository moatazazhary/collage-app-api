const z = require('zod');

const DegreeSchema = z.object({
    fullnameEnglish : z.string('يجب أن يكون نصاً').min(10,'يجب ألا يقل عن 10 أحرف'),
    certificateType : z.string('يجب ان يكون نصاً').min(1,'هذا الحقل مطلوب'),
    degreeTypeIds : z.array(z.string()).nonempty('يجب اختيار خيار واحد على الأقل'),
    bankId : z.string('يجب ان يكون نصاً').min(1,'هذا الحقل مطلوب') ,
    userId : z.string('يجب ان يكون نصاً').min(1,'هذا الحقل مطلوب')
});

module.exports = {DegreeSchema}