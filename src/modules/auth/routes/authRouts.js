
const express = require('express')
const {login,chanegPassword, forgetPassword, getUserInfo, sendOTP, verifyOtp, resetPassword, me, logout} = require('../authController');
const {loginSchema,changePasswordSchema, sendOtpSchema, verifyOtpSchema, resetPasswordSchema} = require('../validations/authValidation')
const {validate} = require('../../../middlewares/validate');
const {validateLoginIdentifier} = require('../../../middlewares/validateLoginIdentifier');
const {authenticateMiddleware} = require('../../../middlewares/authMiddlewares')



const router = express.Router();



/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * 
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: moatazazhary@outlook.sa
 *               password:
 *                 type: string
 *                 example: moataz12@
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: bool
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: login successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: bool
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: wrong identifier or password
 *       400:
 *         description: validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: bool
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: identifier not correct
 */

router.post('/auth/login',validate(loginSchema),validateLoginIdentifier,login);

router.post('/auth/logout',authenticateMiddleware,logout)
/**
 * 
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: bool
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: password changed successfully
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: bool
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: wrong password
 */

router.post('/auth/change-password',authenticateMiddleware,validate(changePasswordSchema),chanegPassword);


/**
 * 
 * @swagger
 * /auth/forget-password:
 *   post:
 *     summary: forget password - for test only
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: moatazazhary@outlook.sa
 *               password:
 *                 type: string
 *                 example: moataz12@
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: bool
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: login successfully

 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: bool
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: wrong identifier or password
 *       400:
 *         description: validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: bool
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: identifier not correct
 */

router.post('/auth/forget-password',forgetPassword);



/**
 * @swagger
 * /auth/sendOtp:
 *   post:
 *     summary: إرسال رمز التحقق OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: رقم الطالب أو الدكتور (اختياري)
 *                 example: "12345"
 *               email:
 *                 type: string
 *                 description: البريد الإلكتروني
 *                 example: example@gmail.com
 *     responses:
 *       200:
 *         description: تم إرسال OTP بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: تم ارسال رمز ال OTP
 *                 email:
 *                   type: string
 *                   example: example@gmail.com
 *       404:
 *         description: الطالب أو الدكتور غير موجود
 *         content:
 *           application/json:
 *             examples:
 *               studentNotFound:
 *                 value:
 *                   success: false
 *                   message: "الطالب غير موجود"
 *               doctorNotFound:
 *                 value:
 *                   success: false
 *                   message: "الدكتور غير موجود"
 *       500:
 *         description: خطأ في الخادم
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: something went wrong !
 *                 error:
 *                   type: string
 *                   example: error.message
 */



router.post('/auth/sendOtp',validate(sendOtpSchema),sendOTP)
/**
 * @swagger
 * /auth/verifyOtp:
 *   post:
 *     summary: التحقق من رمز OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - email
 *             properties:
 *               otp:
 *                 type: integer
 *                 description: رمز OTP مكون من 6 خانات
 *                 example: 123456
 *               email:
 *                 type: string
 *                 description: البريد الإلكتروني
 *                 example: example@gmail.com
 *     responses:
 *       200:
 *         description: تم التأكيد بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: تم التأكيد
 *                 email:
 *                   type: string
 *                   example: example@gmail.com
 *       400:
 *         description: الرمز خاطئ أو انتهت صلاحيته
 *         content:
 *           application/json:
 *             examples:
 *               wrongOtp:
 *                 value:
 *                   success: false
 *                   message: "الرمز خاطئ"
 *               expiredOtp:
 *                 value:
 *                   success: false
 *                   message: "انتهت صلاحية الرمز"
 *       404:
 *         description: المستخدم غير موجود
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "المستخدم غير موجود"
 *       500:
 *         description: خطأ في الخادم
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "something went wrong !"
 *               error: "error.message"
 */



router.post('/auth/verifyOtp',validate(verifyOtpSchema),verifyOtp)
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: إعادة تعيين كلمة المرور
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 description: البريد الإلكتروني
 *                 example: example@gmail.com
 *               password:
 *                 type: string
 *                 description: كلمة المرور الجديدة (6 خانات على الأقل)
 *                 example: newpassword123
 *               confirmPassword:
 *                 type: string
 *                 description: تأكيد كلمة المرور
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: تمت إعادة تعيين كلمة المرور بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: تمت إعادة تعيين كلمة المرور بنجاح
 *       404:
 *         description: المستخدم غير موجود
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "المستخدم غير موجود"
 *       500:
 *         description: خطأ في الخادم
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "something went wrong !"
 *               error: "error.message"
 */


router.post('/auth/reset-password',validate(resetPasswordSchema),resetPassword)
/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: جلب بيانات المستخدم
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم تحميل البيانات بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: تم تحميل البيانات بنجاح
 *                 data:
 *                   type: object
 *                   example:
 *                     id: 1
 *                     name: "أحمد"
 *                     email: "example@gmail.com"
 *       404:
 *         description: المستخدم غير موجود
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "المستخدم غير موجود"
 *       500:
 *         description: خطأ في الخادم
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "something went wrong !"
 *               error: "error.message"
 */

router.get('/auth/profile',authenticateMiddleware,getUserInfo);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: التحقق من هل المستخدم موجود ام لا
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم تحميل البيانات بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       401:
 *         description: غير مصرح
 *         content:
 *           application/json:
 *             example:
 *               authenticated: false
 *       500:
 *         description: خطأ في الخادم
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "something went wrong !"
 *               error: "error.message"
 */

router.get('/auth/me',me)

module.exports = router