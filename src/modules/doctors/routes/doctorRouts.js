const express = require('express');
const {createDoctor,createBulkDoctors, getAllDoctors, getDoctor, updateDoctor, deleteDoctor} = require('../doctorController')
const {createSchema, bulkCreateSchema} = require('../validations/doctorValidations');
const {validate} = require('../../../middlewares/validate');
const {authenticateMiddleware,authorizationMiddleware} = require('../../../middlewares/authMiddlewares')
const {roles} = require('../../../utils/roles')
const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Doctors
 *     description: Doctors endpoints
 */

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: إضافة دكتور جديد
 *     description: |
 *       إنشاء دكتور جديد في النظام.
 *       (صلاحية ADMIN فقط)
 *     tags:
 *       - Doctors
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
 *               - email
 *               - title
 *               - officeNum
 *               - departmentId
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: د. محمد أحمد
 *               address:
 *                 type: string
 *                 example: دمشق - المزة
 *               phone:
 *                 type: string
 *                 example: "0999999999"
 *               email:
 *                 type: string
 *                 example: doctor@gmail.com
 *               title:
 *                 type: string
 *                 example: أستاذ مساعد
 *               password:
 *                 type: string
 *                 example: "123456"
 *               officeNum:
 *                 type: integer
 *                 example: 12
 *               departmentId:
 *                 type: string
 *                 example: dep_123
 *     responses:
 *       201:
 *         description: تمت إضافة الدكتور بنجاح
 *       400:
 *         description: خطأ في إضافة المستخدم
 *       500:
 *         description: خطأ في السيرفر
 */

router.post('/doctors',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),validate(createSchema),createDoctor);

/**
 * @swagger
 * /doctors/bulk:
 *   post:
 *     summary: إضافة دكاترة دفعة واحدة
 *     description: |
 *       إنشاء عدة دكاترة دفعة واحدة.
 *       (ADMIN فقط)
 *     tags:
 *       - Doctors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departmentId
 *               - doctors
 *             properties:
 *               departmentId:
 *                 type: string
 *                 example: dep_123
 *               doctors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - fullname
 *                     - address
 *                     - phone
 *                     - email
 *                     - title
 *                     - officeNum
 *                   properties:
 *                     fullname:
 *                       type: string
 *                       example: د. أحمد علي
 *                     address:
 *                       type: string
 *                       example: حلب
 *                     phone:
 *                       type: string
 *                       example: "0988888888"
 *                     email:
 *                       type: string
 *                       example: ahmed@gmail.com
 *                     title:
 *                       type: string
 *                       example: أستاذ
 *                     officeNum:
 *                       type: integer
 *                       example: 5
 *     responses:
 *       201:
 *         description: تمت إضافة البيانات بنجاح
 *       400:
 *         description: خطأ في إضافة المستخدم
 *       500:
 *         description: خطأ في السيرفر
 */


router.post('/doctors/bulk',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),validate(bulkCreateSchema),createBulkDoctors)

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: جلب جميع الدكاترة
 *     description: |
 *       إرجاع قائمة الدكاترة مع pagination.
 *       (ADMIN فقط)
 *     tags:
 *       - Doctors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم تحميل البيانات بنجاح
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/doctors',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),getAllDoctors);

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: جلب بيانات دكتور
 *     description: إرجاع بيانات دكتور محدد.
 *     tags:
 *       - Doctors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الدكتور
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم تحميل البيانات بنجاح
 *       404:
 *         description: الدكتور غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */


router.get('/doctors/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN,roles.DOCTOR),getDoctor)

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: تعديل بيانات دكتور
 *     description: تحديث معلومات دكتور.
 *     tags:
 *       - Doctors
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
 *         description: تم تعديل الدكتور بنجاح
 *       400:
 *         description: خطأ في تعديل الدكتور
 *       404:
 *         description: الدكتور غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.put('/doctors/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),validate(createSchema),updateDoctor);

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: حذف دكتور
 *     description: حذف دكتور من النظام.
 *     tags:
 *       - Doctors
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
 *         description: تم حذف الدكتور بنجاح
 *       404:
 *         description: الدكتور غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.delete('/doctors/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),deleteDoctor)

module.exports = router;