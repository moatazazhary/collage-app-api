const multer = require('multer');
const path = require('path');
const {fileUploadError} = require('../errors/fileUploadErrors')

const UPLOADS_DIR = process.env.UPLOADS_DIR;

const storage = multer.diskStorage({
    
    destination : (req,file,cd)=>{


        const folderType = req.body.targetType
        let folder;
        switch (folderType) {
            case 'course':
                folder = folderType
                break;
            case 'lecture':
                folder = folderType
                break;
            case 'research':
                folder = folderType
                break;
            case 'exam':
                folder = folderType
                break;
        
            default:
                folder = 'others'
        };

        const uploadFoler = path.join(UPLOADS_DIR,folder);
        cd(null,uploadFoler)
    },
    filename : (req,file,cd)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cd(null,uniqueSuffix + '-'+file.originalname)
    }
});

const fileFilter = (req,file,cd)=>{

    const request = req.body;
    let allowedExtensions = ['.pdf','.doc','.docx','.ppt','.pptx','.xls','.xlsx','.png','.jpg','.jpeg'];
    const researchExtenstions = ['.pdf','.doc','.docx']
    const extension = path.extname(file.originalname).toLowerCase();

    if(request.fileType === 'محاضرة'){
        allowedExtensions = ['.pdf','.doc','.docx','.ppt','.pptx','.xls','.xlsx'];
    }

    if(!allowedExtensions.includes(extension) || (request.targetType === 'research' && !researchExtenstions.includes(extension)))
        return cd(new fileUploadError("هذا الملف غير مسموح به",415),false)

    cd(null,true);
}


const uploads = multer({
storage,
limits : {fileSize : 10 * 1024 * 1024},
fileFilter :fileFilter
});

module.exports = {uploads};