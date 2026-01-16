const fs = require('fs');
const path = require('path');
const UPLOADS_DIR = process.env.UPLOADS_DIR;

function SetUploadsPath (){

    try{
        if(!fs.existsSync(UPLOADS_DIR)){
        fs.mkdirSync(UPLOADS_DIR,{recursive:true});
        }

        ['course','lecture','research','exam','degreeRequests'].forEach(folder =>{
            const folderPath = path.join(UPLOADS_DIR,folder);
            if(!fs.existsSync(folderPath)){
                fs.mkdirSync(folderPath,{recursive:true})
            }
        })
    }catch(error){
        console.error(error);
    }
}

module.exports = {SetUploadsPath,UPLOADS_DIR}