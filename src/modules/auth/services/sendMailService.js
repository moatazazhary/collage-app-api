const {transporter} = require('../../../configs/nodeMailerConfig');


const sendOTPMail = async (to,name,time,subject,otp)=>{
    try{
        await transporter.sendMail({
        from : process.env.EMAIL_USER,
        to : to,
        subject : subject,
        html : `
        <!doctype html>
            <html lang="ar" dir="rtl">

            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>OTP Email Template</title>

            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">

            
            <style>
                body{
            
                font-family: "Alexandria",Arial, sans-serif;
                font-optical-sizing: auto;
                font-weight: <weight>;
                font-style: normal;
                }
            </style>
            <link rel="stylesheet" href="/style.css">
            </head>

            <body style=" 
                            background-color: #f4f4f4;
                            padding: 0;
                            margin: 0;">
                            <div class="container-sec" style="background-color: #ffffff;
                            border-radius: 8px;
                            padding: 20px;
                            margin-top: 30px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                            max-width: 600px;">

                <div class="text-center">
                <div><i class="fas fa-lock otp-lock" style="color: #333;
                    font-size: 80px;"></i></div>
                <div class="welcome-section" style="  background: #144fa9db;
            padding: 30px;
            border-radius: 4px;
            color: #fff;
            font-size: 20px;
            margin: 20px 0px;text-align:center;">
                    <div class="app-name" style="  font-size: 30px;
            font-weight: 800;
            margin: 7px 0px; text-align:center;">
                    كلية الإقتصاد والعلوم الإدارية
                    </div>
                    <div class="welcome-text" style="font-family: monospace;">
                    شكراً للدخول
                    </div>

                    <div class="verify-text" style="margin-top: 25px;
            font-size: 25px;
            letter-spacing: 3px;">
                    يرجى تأكيد عنوان بريدك
                    </div>
                    <div class="email-icon" style="margin-top:20px;">
                    <i class="fas fa-envelope-open" style:"font-size: 35px !important;
            color: #ffffff;"></i>
                    </div>

                </div>
                <h2 style="text-align:center; margin-top:10px;">مرحبا, ${name}</h2>
                <p style="text-align:center;">رمز التحقق (OTP) الخاص بك لمرة واحدة هو :</p>
                <div class="otp-code" style="  font-size: 24px;
            font-weight: bold;
            background-color: #f8f9fa;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
            border: 1px dashed #007bff;
            color: #007bff;">${otp}</div>
                <p class="" style="margin-top:10px;">يرجى استخدام رمز المرور لمرة واحدة لإكمال التحقق الخاص بك  رمز المرور صالح لمدة ${time} دقائق فقط</p>
                
                </div>
                <div class="footer-text" style="  color: #6c757d;
            font-size: 14px;
            text-align: center;
            margin-top: 20px;">
                <p>لو لم تطلب هذا الرمز رجاءاً <a href="#" style="  color: #007bff;
            text-decoration: none;">تواصل معنا</a> فوراً.</p>
                <p>شكراَ لك,<br> فريق الكلية </p>
                </div>
            </div>

            <script 
            </body>

            </html>
        
        `
    })
    }catch(error){
        throw new Error(`Error while sending mail , Error : ${error.messge}`)
    }
}


module.exports = {sendOTPMail}