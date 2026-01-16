const multer = require('multer');
const path = require('path');


const UPLOADS_DIR = process.env.UPLOADS_DIR;

const storage = multer.diskStorage({
    destination : (req,file,cd)=>{   
        const uploadFoler = path.join(UPLOADS_DIR,'degreeRequests');
        cd(null,uploadFoler)
    },
    filename : (req,file,cd)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cd(null,uniqueSuffix + '-'+file.originalname)
    }
});

const fileFilter = (req,file,cd)=>{
    const allowedExtensions = ['.png','.jpg','.jpeg'];
    const extension = path.extname(file.originalname).toLowerCase();
    let maxSize = 4 * 1024 * 1024

    if(!allowedExtensions.includes(extension))
        return cd(new Error('هذا النوع غير مسموح به'),false)
    if(file.size > maxSize)
        return cd(new Error(`يجب ان يكون حجم الملف في حدود ال ${maxSize / (1024 * 1024)}`))

    cd(null,true);
}


const uploads = multer({
storage,
fileFilter : fileFilter
});

const uploadDegreeRequirements = uploads.fields([
    {name :"personalPhoto",maxCount:1},
    {name :"personalPhoto2",maxCount:1},
    {name :"idCardPhoto",maxCount:1},
    {name :"paymentPhoto",maxCount:1}
])

module.exports = {uploadDegreeRequirements};