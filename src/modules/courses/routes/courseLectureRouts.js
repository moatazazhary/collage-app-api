const express = require('express');
const {authenticateMiddleware,authorizationMiddleware} = require('../../../middlewares/authMiddlewares')
const {validate} = require('../../../middlewares/validate')
const {roles} = require('../../../utils/roles')
const {addDotorToCourseSchema,createCourseSchema,updateCourseSchema,createLectureSchema,updateLectureSchema} = require('../validations/coureLectureValidations');
const {createCourse,getAllCuorses,getCourse,addDoctorToCourse,createLecture,getAllLectures,getLecture, updateCourse, deleteCourse, updateLecture, deleteLecture} = require('../courseLectureController');

const router = express.Router();



// courses

/**
 * @swagger
 * tags:
 *   - name: Courses
 *     description: Courses endpoints
 */


/**
 * @swagger
 * /courses:
 *   post:
 *     summary: إضافة كورس جديد
 *     description: |
 *       إنشاء كورس جديد وربطه بقسم وسمستر ودكتور (اختياري).
 *       (صلاحية ADMIN فقط)
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - departmentId
 *               - semesterNum
 *               - isDoctorCurrent
 *             properties:
 *               name:
 *                 type: string
 *                 example: قواعد البيانات
 *               description:
 *                 type: string
 *                 example: مقدمة في قواعد البيانات العلائقية
 *               departmentId:
 *                 type: string
 *                 example: dep_123
 *               semesterNum:
 *                 type: integer
 *                 example: 3
 *               doctorId:
 *                 type: string
 *                 example: doc_456
 *               isDoctorCurrent:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: تمت إضافة الكورس بنجاح
 *       400:
 *         description: خطأ في إضافة الكورس
 *       404:
 *         description: القسم أو السمستر أو الدكتور غير موجود
 *       500:
 *         description: خطأ*
*/

router.post('/courses',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),validate(createCourseSchema),createCourse);

/**
 * @swagger
 * /courses/add-doctor-to-course:
 *   post:
 *     summary: إضافة دكتور إلى كورس
 *     description: |
 *       ربط دكتور بكورس معيّن.
 *       (ADMIN فقط)
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - courseId
 *               - isDoctorCurrent
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: doc_123
 *               courseId:
 *                 type: string
 *                 example: course_456
 *               isDoctorCurrent:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: تمت إضافة الدكتور للكورس بنجاح
 *       400:
 *         description: خطأ في إضافة الدكتور للكورس
 *       404:
 *         description: الكورس أو الدكتور غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.post('/courses/add-doctor-to-course',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),validate(addDotorToCourseSchema),addDoctorToCourse);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: جلب جميع الكورسات
 *     description: |
 *       إرجاع قائمة بجميع الكورسات.
 *       (يتطلب تسجيل دخول)
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم جلب الكورسات بنجاح
 *       500:
 *         description: خطأ في السيرفر
 */


router.get('/courses',authenticateMiddleware,getAllCuorses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: جلب بيانات كورس
 *     description: إرجاع تفاصيل كورس محدد.
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الكورس
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم جلب بيانات الكورس بنجاح
 *       404:
 *         description: الكورس غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/courses/:id',authenticateMiddleware,getCourse);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: تعديل بيانات كورس
 *     description: |
 *       تحديث معلومات كورس.
 *       (ADMIN فقط)
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الكورس
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - semesterNum
 *             properties:
 *               name:
 *                 type: string
 *                 example: هندسة البرمجيات
 *               description:
 *                 type: string
 *                 example: أساسيات تصميم البرمجيات
 *               semesterNum:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: تم تعديل الكورس بنجاح
 *       404:
 *         description: الكورس غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.put('/courses/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),validate(updateCourseSchema),updateCourse)

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: حذف كورس
 *     description: |
 *       حذف كورس من النظام.
 *       (ADMIN فقط)
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الكورس
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم حذف الكورس بنجاح
 *       404:
 *         description: الكورس غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.delete('/courses/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),deleteCourse);


// lectures


/**
 * @swagger
 * tags:
 *   - name: Lectures
 *     description: lectures endpoints
 */

/**
 * @swagger
 * /lectures:
 *   post:
 *     summary: إضافة محاضرة جديدة
 *     description: |
 *       إنشاء محاضرة جديدة وربطها بكورس.
 *       (صلاحية DOCTOR فقط)
 *     tags:
 *       - Lectures
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - title
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: course_123
 *               title:
 *                 type: string
 *                 example: مقدمة في قواعد البيانات
 *     responses:
 *       201:
 *         description: تمت إضافة المحاضرة بنجاح
 *       400:
 *         description: خطأ في إضافة المحاضرة
 *       404:
 *         description: الكورس غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */


router.post('/lectures',authenticateMiddleware,authorizationMiddleware(roles.DOCTOR),validate(createLectureSchema),createLecture);

/**
 * @swagger
 * /lectures:
 *   get:
 *     summary: جلب جميع المحاضرات
 *     description: |
 *       إرجاع قائمة بجميع المحاضرات.
 *       (يتطلب تسجيل دخول)
 *     tags:
 *       - Lectures
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم جلب المحاضرات بنجاح
 *       500:
 *         description: خطأ في السيرفر
 */


router.get('/lectures',authenticateMiddleware,getAllLectures);

/**
 * @swagger
 * /lectures/{id}:
 *   get:
 *     summary: جلب بيانات محاضرة
 *     description: إرجاع تفاصيل محاضرة محددة.
 *     tags:
 *       - Lectures
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم المحاضرة
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم جلب بيانات المحاضرة بنجاح
 *       404:
 *         description: المحاضرة غير موجودة
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/lectures/:id',authenticateMiddleware,getLecture);

/**
 * @swagger
 * /lectures/{id}:
 *   put:
 *     summary: تعديل محاضرة
 *     description: |
 *       تحديث عنوان المحاضرة.
 *       (صلاحية DOCTOR فقط)
 *     tags:
 *       - Lectures
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم المحاضرة
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: المحاضرة الأولى
 *     responses:
 *       200:
 *         description: تم تعديل المحاضرة بنجاح
 *       404:
 *         description: المحاضرة غير موجودة
 *       500:
 *         description: خطأ في السيرفر
 */

router.put('/lectures/:id',authenticateMiddleware,authorizationMiddleware(roles.DOCTOR),validate(updateLectureSchema),updateLecture);

/**
 * @swagger
 * /lectures/{id}:
 *   delete:
 *     summary: حذف محاضرة
 *     description: |
 *       حذف محاضرة من النظام.
 *       (صلاحية DOCTOR فقط)
 *     tags:
 *       - Lectures
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم المحاضرة
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم حذف المحاضرة بنجاح
 *       404:
 *         description: المحاضرة غير موجودة
 *       500:
 *         description: خطأ في السيرفر
 */

router.delete("/lectures/:id",authenticateMiddleware,authorizationMiddleware(roles.DOCTOR),deleteLecture);


module.exports = router;








