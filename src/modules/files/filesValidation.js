const z = require('zod');

const uploadSchema = z.object({
    targetType : z.string().min(1,"هذا الحقل مطلوب"),
    targetId : z.string().min(1,"هذا الحقل مطلوب"),
    fileType : z.string().min(1,"هذا الحقل مطلوب"),
});


module.exports = {uploadSchema};