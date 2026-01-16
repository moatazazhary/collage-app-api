const express = require('express');
const {authenticateMiddleware,authorizationMiddleware} = require('../../middlewares/authMiddlewares')
const {validate} = require('../../middlewares/validate')
const {getAllExams,createExam,get,updateExam,deleteExam, getExam} = require('./examController')
const {formSchema} = require('./examValidation');
const { roles } = require('../../utils/roles');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Exams
 *     description: exams endpoints
 */


/**
 * @swagger
 * /exams:
 *   post:
 *     summary: إضافة امتحان جديد
 *     description: |
 *       إنشاء امتحان جديد وربطه بقسم، كورس، ملف، وسمستر.
 *       (يتطلب تسجيل دخول)
 *     tags:
 *       - Exams
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - year
 *               - departmentId
 *               - courseId
 *               - sememsterNum
 *             properties:
 *               title:
 *                 type: string
 *                 example: امتحان منتصف الفصل
 *               year:
 *                 type: integer
 *                 example: 2024
 *               departmentId:
 *                 type: string
 *                 example: dep_123
 *               courseId:
 *                 type: string
 *                 example: course_456
 *               semesterNum:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: تم تعديل الامتحان بنجاح
 *       404:
 *         description: الامتحان غير موجود
 *       500:
 *         description: خطأ في السيرفر
*/
router.post('/exams',authenticateMiddleware,validate(formSchema),createExam);

/**
 * @swagger
 * /exams:
 *   get:
 *     summary: جلب جميع الامتحانات
 *     description: |
 *       إرجاع قائمة بجميع الامتحانات.
 *       (يتطلب تسجيل دخول)
 *     tags:
 *       - Exams
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم تحميل البيانات بنجاح
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/exams',authenticateMiddleware,getAllExams);

/**
 * @swagger
 * /exams/{id}:
 *   get:
 *     summary: جلب بيانات امتحان
 *     description: إرجاع تفاصيل امتحان محدد.
 *     tags:
 *       - Exams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الامتحان
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم تحميل بيانات الامتحان بنجاح
 *       404:
 *         description: الامتحان غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/exams/:id',authenticateMiddleware,getExam)

/**
 * @swagger
 * /exams/{id}:
 *   put:
 *     summary: تعديل امتحان
 *     description: |
 *       تحديث بيانات امتحان موجود.
 *       (يتطلب تسجيل دخول)
 *     tags:
 *       - Exams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الامتحان
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
 *               - year
 *               - departmentId
 *               - courseId
 *               - semesterNum
 *             properties:
 *               title:
 *                 type: string
 *                 example: امتحان منتصف الفصل
 *               year:
 *                 type: integer
 *                 example: 2024
 *               departmentId:
 *                 type: string
 *                 example: dep_123
 *               courseId:
 *                 type: string
 *                 example: course_456
 *               semesterNum:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: تم تعديل الامتحان بنجاح
 *       404:
 *         description: الامتحان غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.put('/exams/:id',authenticateMiddleware,validate(formSchema),updateExam)

/**
 * @swagger
 * /exams/{id}:
 *   delete:
 *     summary: حذف امتحان
 *     description: |
 *       حذف امتحان من النظام.
 *       (صلاحية ADMIN فقط)
 *     tags:
 *       - Exams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الامتحان
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم حذف الامتحان بنجاح
 *       404:
 *         description: الامتحان غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.delete('/exams/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),deleteExam);


module.exports = router