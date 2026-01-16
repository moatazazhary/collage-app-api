const express = require('express');
const {validate} = require('../../middlewares/validate')
const {authenticateMiddleware,authorizationMiddleware} = require('../../middlewares/authMiddlewares')
const {formSchema} = require('./researchValidations');
const {createResearch,getAllResearchs,getResearch,updateResearch,deleteResearch } = require('./researchController');
const { roles } = require('../../utils/roles');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Researchs
 *     description: researchs endpoints
 */

/**
 * @swagger
 * /researchs:
 *   post:
 *     summary: إضافة بحث جديد
 *     description: |
 *       إنشاء بحث علمي جديد مع تحديد المشرف والمؤلفين.
 *       (يتطلب تسجيل دخول)
 *     tags:
 *       - Researchs
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
 *               - abstract
 *               - type
 *               - departmentId
 *               - role
 *               - supervisorId
 *               - authors
 *             properties:
 *               title:
 *                 type: string
 *                 example: تحليل أداء الخوارزميات في الذكاء الاصطناعي
 *               year:
 *                 type: integer
 *                 example: 2023
 *               abstract:
 *                 type: string
 *                 example: هذا البحث يتناول دراسة تفصيلية حول أداء الخوارزميات...
 *               type:
 *                 type: string
 *                 example: بحث تخرج
 *               departmentId:
 *                 type: string
 *                 example: dep_123
 *               role:
 *                 type: string
 *                 example: طالب
 *               supervisorId:
 *                 type: string
 *                 example: doctor_456
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["student_1", "student_2"]
 *     responses:
 *       201:
 *         description: تمت إضافة البحث بنجاح
 *       400:
 *         description: لم تتم إضافة البحث
 *       500:
 *         description: خطأ في السيرفر
 */

router.post('/researchs',authenticateMiddleware,validate(formSchema),createResearch);

/**
 * @swagger
 * /researchs:
 *   get:
 *     summary: جلب جميع الأبحاث
 *     description: |
 *       إرجاع قائمة بجميع الأبحاث.
 *       (يتطلب تسجيل دخول)
 *     tags:
 *       - Researchs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم تحميل البيانات بنجاح
 *       404:
 *         description: البحث غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/researchs',authenticateMiddleware,getAllResearchs);

/**
 * @swagger
 * /researchs/{id}:
 *   get:
 *     summary: جلب بيانات بحث
 *     description: إرجاع تفاصيل بحث محدد.
 *     tags:
 *       - Researchs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم البحث
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم تحميل بيانات البحث بنجاح
 *       404:
 *         description: البحث غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/researchs/:id',authenticateMiddleware,getResearch);

/**
 * @swagger
 * /researchs/{id}:
 *   put:
 *     summary: تعديل بحث
 *     description: |
 *       تحديث بيانات بحث موجود.
 *       (يتطلب تسجيل دخول)
 *     tags:
 *       - Researchs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم البحث
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
 *         description: تم تعديل البحث بنجاح
 *       404:
 *         description: البحث غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */


router.put('/researchs/:id',authenticateMiddleware,validate(formSchema),updateResearch);
/**
 * @swagger
 * /researchs/{id}:
 *   delete:
 *     summary: حذف بحث
 *     description: |
 *       حذف بحث من النظام.
 *       (صلاحية ADMIN فقط)
 *     tags:
 *       - Researchs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم البحث
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم حذف البحث بنجاح
 *       404:
 *         description: البحث غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.delete('/researchs/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),deleteResearch)


module.exports = router;