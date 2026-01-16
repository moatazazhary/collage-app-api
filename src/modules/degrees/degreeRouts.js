const express = require('express');
const {authenticateMiddleware,authorizationMiddleware} = require('../../middlewares/authMiddlewares')
const {uploadDegreeRequirements} = require('../../middlewares/degreeUploadsMiddleware')
const {validate} = require('../../middlewares/validate')
const {requestDegree,approveRequest,rejectRequest,openRequest,getAllRequests,getDegreeRequest, degreeTypes, banks} = require('./degreeController')
const {DegreeSchema} = require('./degreeValidation');
const { roles } = require('../../utils/roles');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Degrees
 *     description: degrees endpoints
 */



/**
 * @swagger
 * /degrees/request:
 *   post:
 *     summary: تقديم طلب شهادة
 *     description: |
 *       تقديم طلب شهادة مع رفع المتطلبات (صور).
 *       (صلاحية STUDENT فقط)
 *     tags:
 *       - Degrees
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - certificateType
 *               - personalPhoto
 *               - idCardPhoto
 *               - paymentPhoto
 *               - bankId
 *               - userId
 *             properties:
 *               certificateType:
 *                 type: string
 *                 example: شهادة تخرج
 *               personalPhoto:
 *                 type: string
 *                 format: binary
 *               personalPhoto2:
 *                 type: string
 *                 format: binary
 *               idCardPhoto:
 *                 type: string
 *                 format: binary
 *               paymentPhoto:
 *                 type: string
 *                 format: binary
 *               bankId:
 *                 type: string
 *                 example: bank_123
 *               userId:
 *                 type: string
 *                 example: user_456
 *     responses:
 *       201:
 *         description: تم التقديم بنجاح
 *       400:
 *         description: |
 *           بيانات غير صحيحة (الدفع أو الصور) أو حدث خطأ في التقديم
 *       500:
 *         description: خطأ في السيرفر
 */

router.post('/degrees/request',authenticateMiddleware,authorizationMiddleware(roles.STDUENT),uploadDegreeRequirements,validate(DegreeSchema),requestDegree);

/**
 * @swagger
 * /degrees/approve/{id}:
 *   post:
 *     summary: قبول طلب شهادة
 *     description: |
 *       الموافقة على طلب شهادة.
 *       (صلاحية ADMIN فقط)
 *     tags:
 *       - Degrees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الطلب
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم قبول الطلب بنجاح
 *       404:
 *         description: الطلب غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.post('/degrees/approve/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),approveRequest);

/**
 * @swagger
 * /degrees/reject/{id}:
 *   post:
 *     summary: رفض طلب شهادة
 *     description: |
 *       رفض طلب شهادة.
 *       (صلاحية ADMIN فقط)
 *     tags:
 *       - Degrees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الطلب
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم رفض الطلب
 *       404:
 *         description: الطلب غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.post('/degrees/reject/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),rejectRequest);
/**
 * @swagger
 * /degrees/open/{id}:
 *   post:
 *     summary: فتح طلب شهادة
 *     description: |
 *       إعادة فتح طلب شهادة بعد الرفض أو الإغلاق.
 *       (صلاحية ADMIN فقط)
 *     tags:
 *       - Degrees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الطلب
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم فتح الطلب بنجاح
 *       404:
 *         description: الطلب غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.post('/degrees/open/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),openRequest);

/**
 * @swagger
 * /degrees:
 *   get:
 *     summary: جلب جميع طلبات الشهادات
 *     description: |
 *       إرجاع قائمة بجميع طلبات الشهادات.
 *       (صلاحية ADMIN فقط)
 *     tags:
 *       - Degrees
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم تحميل البيانات بنجاح
 *       404:
 *         description: لا توجد طلبات
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/degrees/',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),getAllRequests)

/**
 * @swagger
 * /degrees/{id}:
 *   get:
 *     summary: جلب تفاصيل طلب شهادة
 *     description: إرجاع بيانات طلب شهادة محدد.
 *     tags:
 *       - Degrees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم الطلب
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم تحميل البيانات بنجاح
 *       404:
 *         description: الطلب غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/degrees/:id',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),getDegreeRequest)


router.get('/degree-types',authenticateMiddleware,degreeTypes);
router.get('/banks',authenticateMiddleware,banks);


module.exports = router