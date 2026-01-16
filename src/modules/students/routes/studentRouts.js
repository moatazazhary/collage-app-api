const express  = require('express');
const {validate} = require('../../../middlewares/validate')
const {createStudent,getStudentDegreeRequests, createBulkStudents, getAllStudents, getStudent, updateStudent, deleteStudent} = require('../studentConroller')
const {authenticateMiddleware,authorizationMiddleware} = require('../../../middlewares/authMiddlewares')
const {createSchema,bulkCreateSchema} = require('../validations/studentValidation')
const {roles} = require('../../../utils/roles')
const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Students
 *     description: Students endpoints
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: إضافة طالب جديد
 *     description: |
 *       إنشاء طالب جديد في النظام.
 *       (مسموح فقط للمشرف ADMIN)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - address
 *               - phone
 *               - facultyNum
 *               - semesterNum
 *               - departmentId
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: أحمد محمد علي
 *               address:
 *                 type: string
 *                 example: دمشق - المزة
 *               phone:
 *                 type: string
 *                 example: "0999999999"
 *               email:
 *                 type: string
 *                 example: ahmed@email.com
 *               facultyNum:
 *                 type: string
 *                 example: "202312345"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               semesterNum:
 *                 type: integer
 *                 example: 1
 *               departmentId:
 *                 type: string
 *                 example: "dep_123"
 *     responses:
 *       200:
 *         description: تمت إضافة الطالب بنجاح
 *       400:
 *         description: خطأ في إضافة الطالب
 *       500:
 *         description: خطأ في السيرفر
 */

router.post('/students',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),validate(createSchema),createStudent);

/**
 * @swagger
 * /students/bulk:
 *   post:
 *     summary: إضافة طلاب دفعة واحدة
 *     description: |
 *       إنشاء عدة طلاب دفعة واحدة.
 *       (ADMIN فقط)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - semesterNum
 *               - departmentId
 *               - students
 *             properties:
 *               semesterNum:
 *                 type: integer
 *                 example: 1
 *               departmentId:
 *                 type: string
 *                 example: "dep_123"
 *               students:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - fullname
 *                     - address
 *                     - phone
 *                     - facultyNum
 *                   properties:
 *                     fullname:
 *                       type: string
 *                       example: محمد أحمد
 *                     address:
 *                       type: string
 *                       example: حلب
 *                     phone:
 *                       type: string
 *                       example: "0988888888"
 *                     email:
 *                       type: string
 *                       example: mo@email.com
 *                     facultyNum:
 *                       type: string
 *                       example: "202311111"
 *     responses:
 *       201:
 *         description: تمت إضافة البيانات بنجاح
 *       500:
 *         description: خطأ في السيرفر
 */

router.post('/students/bulk',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),validate(bulkCreateSchema),createBulkStudents)


/**
 * @swagger
 * /students/degree-requests/{id}:
 *   get:
 *     summary: جلب طلبات الشهادات للطالب
 *     description: |
 *       إرجاع جميع طلبات الشهادات الخاصة بالطالب.
 *       (STUDENT فقط)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الطالب
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم تحميل البيانات بنجاح
 *       500:
 *         description: خطأ في السيرفر
 */


router.get('/students/degree-requests/:id',authenticateMiddleware,authorizationMiddleware(roles.STDUENT),getStudentDegreeRequests)

/**
 * @swagger
 * /students:
 *   get:
 *     summary: جلب جميع الطلاب
 *     description: |
 *       إرجاع قائمة الطلاب مع pagination.
 *       (ADMIN فقط)
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم تحميل البيانات بنجاح
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/students',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),getAllStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: جلب بيانات طالب
 *     description: إرجاع بيانات طالب محدد.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الطالب
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم تحميل البيانات بنجاح
 *       404:
 *         description: الطالب غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/students/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),getStudent)

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: تعديل بيانات طالب
 *     description: تحديث معلومات طالب.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: تم تعديل الطالب بنجاح
 *       400:
 *         description: خطأ في تعديل الطالب
 *       500:
 *         description: خطأ في السيرفر
 */

router.put('/students/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),validate(createSchema),updateStudent);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: حذف طالب
 *     description: حذف طالب من النظام.
 *     tags:
 *       - Students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم حذف الطالب بنجاح
 *       404:
 *         description: الطالب غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.delete('/students/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),deleteStudent)

module.exports = router