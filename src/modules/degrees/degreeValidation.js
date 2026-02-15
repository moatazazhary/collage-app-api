const z = require('zod');

const DegreeSchema = z.object({
    fullnameEnglish : z.string('يجب أن يكون نصاً').min(10,'يجب ألا يقل عن 10 أحرف'),
    certificateType : z.string('يجب ان يكون نصاً').min(1,'هذا الحقل مطلوب'),
    degreeTypeIds : z.array(z.string()).nonempty('يجب اختيار خيار واحد على الأقل'),
    bankId : z.string('يجب ان يكون نصاً').min(1,'هذا الحقل مطلوب') ,
    userId : z.string('يجب ان يكون نصاً').min(1,'هذا الحقل مطلوب')
});

const requestNoteForm = z.object({
    notes : z.string('هذا الحقل مطلوب').min(1,'هذا الحقل مطلوب').min(15,'لا يمكن أن يكون أقل من 15 حرف'),
});


module.exports = {DegreeSchema,requestNoteForm}