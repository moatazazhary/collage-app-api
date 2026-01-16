const z = require('zod');

const createCourseSchema = z.object({
    name : z.string().min(1,{message : "اسم الكورس مطلوب"}),
    description : z.string().min(1,{message : " التفاصيل مطلوبة"}),
    departmentId : z.string().min(1,{message : "القسم مطلوب"}),
    semesterNum : z.int().min(1,{message : " السمستر مطلوب"}),
    doctorId : z.string().min(0),
    isDoctorCurrent : z.boolean()
});
const updateCourseSchema = z.object({
    name : z.string().min(1,{message : "اسم الكورس مطلوب"}),
    description : z.string().min(1,{message : " التفاصيل مطلوبة"}),
    semesterNum : z.int().min(1,{message : " السمستر مطلوب"}),
});

const addDotorToCourseSchema = z.object({
    doctorId : z.string().min(1,{message : " الدكتور مطلوب"}),
    courseId : z.string().min(1,{message : " الكورس مطلوب"}),
    isDoctorCurrent : z.boolean()
})


const createLectureSchema = z.object({
    courseId : z.string().min(1,{message : " الكورس مطلوب"}),
    title : z.string().min(1,{message : " العنوان مطلوب"})
});

const updateLectureSchema = z.object({
    title : z.string().min(1,{message : " العنوان مطلوب"})
});


module.exports = {createCourseSchema,updateCourseSchema,createLectureSchema,updateLectureSchema,addDotorToCourseSchema}