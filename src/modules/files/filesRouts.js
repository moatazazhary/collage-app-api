const express = require('express');
const {authenticateMiddleware,authorizationMiddleware} = require('../../middlewares/authMiddlewares')
const {uploads} = require('../../middlewares/uploadsMiddleware')
const {validate} = require('../../middlewares/validate')

const {uploadFile,getAllowedTypes, approveMaterial} = require('./filesController')
const {uploadSchema} = require('./filesValidation');
const { roles } = require('../../utils/roles');
const { uploadErrorHandler } = require('../../middlewares/uploadErrorsMiddleware');


const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Files
 *     description: files endpoints
 */

/**
 * @swagger
 * /files:
 *   post:
 *     summary: رفع ملف
 *     description: |
 *       رفع ملف وربطه بكيان معين (محاضرة، كورس، بحث...).
 *       (يتطلب تسجيل دخول)
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - targetType
 *               - targetId
 *               - fileType
 *               - file
 *             properties:
 *               targetType:
 *                 type: string
 *                 example: lecture
 *               targetId:
 *                 type: string
 *                 example: lec_123
 *               fileType:
 *                 type: string
 *                 example: محاضرة
 *               file:
 *                 type: file
 
 *     responses:
 *       201:
 *         description: تم رفع الملف بنجاح
 *       400:
 *         description: لم يتم رفع الملف أو حدث خطأ في الرفع
 *       500:
 *         description: خطأ في السيرفر
 */

router.post('/files',authenticateMiddleware,(req,res,next)=> uploads.single('file')(req,res,(err)=>uploadErrorHandler(req,res,next)(err)),validate(uploadSchema),uploadFile);

/**
 * @swagger
 * /files/approve-material:
 *   post:
 *     summary: الموافقة على ملف
 *     description: |
 *       الموافقة على ملف مرفوع.
 *       (صلاحية ADMIN فقط)
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تمت الموافقة بنجاح
 *       404:
 *         description: الملف غير موجود
 *       500:
 *         description: خطأ في السيرفر
 */

router.post('/files/approve-material',authenticateMiddleware,authorizationMiddleware(roles.ADMIN),approveMaterial);

/**
 * @swagger
 * /files/file-types:
 *   get:
 *     summary: جلب أنواع الملفات
 *     description: |
 *       إرجاع قائمة بأنواع الملفات المسموح بها حسب الصلاحية.
 *       (يتطلب تسجيل دخول)
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم جلب الأنواع بنجاح
 *         content:
 *           application/json:
 *             examples:
 *               student:
 *                 value:
 *                   success: true
 *                   message: تم جلب الأنواع بنجاح
 *                   data:
 *                     - إمتحان
 *                     - ملخص
 *               doctor:
 *                 value:
 *                   success: true
 *                   message: تم جلب الأنواع بنجاح
 *                   data:
 *                     - إمتحان
 *                     - ملخص
 *                     - محتوى المقرر كاملاً
 *                     - محاضرة
 *                     - ملف مساعد
 *       500:
 *         description: خطأ في السيرفر
 */

router.get('/files/file-types',authenticateMiddleware,getAllowedTypes);



module.exports = router

