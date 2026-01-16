function generateOtp (){
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const now =  new Date();
    const expireDate = new Date(now.getTime() + 5*60000);

    return {otp,expireDate}
}

function checkLimit(expireDate , limit,){
    if(limit > 5){
        return {status : false,message :"تم تجاوز الحد اليومي"}
    }

    if(expireDate && expireDate !== null){
        if(expireDate > new Date()){
            return {status : false,message :"أدخل الرمز الذي تم إرساله مسبقاً"} 
        }
    }

    return {status : true ,message : ''}

}


module.exports = {generateOtp,checkLimit}