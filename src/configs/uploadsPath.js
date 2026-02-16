const fs = require('fs');
const path = require('path');
const UPLOADS_DIR = process.env.UPLOADS_DIR;

function SetUploadsPath (){

    try{
        console.log('🌱 Starting the uploads dir creation...\n')
        if(!fs.existsSync(UPLOADS_DIR)){
            fs.mkdirSync(UPLOADS_DIR,{recursive:true});
            console.log('✔️ Bank data created successfully \n')
        }

        console.log('   Start to create sub folders...\n')
        const folders = ['course','lecture','research','degreeRequests','exam'];
        folders.forEach(folder =>{
            const folderPath = path.join(UPLOADS_DIR,folder);
            if(!fs.existsSync(folderPath)){
                fs.mkdirSync(folderPath,{recursive:true})
            }
        })

        console.log('\n🎉 Uploads dir folder creation completed successfully!');
            console.log('\n📋 Summary: created these folders :');
            console.log('   - course');
            console.log('   - lecture');
            console.log('   - research');
            console.log('   - exam');
            console.log('   - degreeRequests');
    }catch(error){
        console.log('\n ❌ Error while creating the uploads folder ...');
        console.error(error);
    }
}

module.exports = {SetUploadsPath,UPLOADS_DIR}