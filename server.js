require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const {rateLimit} = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const {SetUploadsPath,UPLOADS_DIR} = require('./src/configs/uploadsPath')
const authRouts = require('./src/modules/auth/routes/authRouts')
const studentRouts = require('./src/modules/students/routes/studentRouts')
const doctorRouts = require('./src/modules/doctors/routes/doctorRouts')
const courseLectureRouts = require('./src/modules/courses/routes/courseLectureRouts')
const researchRouts = require('./src/modules/researchs/researchRouts')
const fileRouts =  require('./src/modules/files/filesRouts')
const degreeRouts=  require('./src/modules/degrees/degreeRouts')
const examRouts =  require('./src/modules/exams/examRouts')
const coreRouts = require('./src/modules/core/coreRouts')
const cookieParser = require('cookie-parser')
const cors = require('cors');


const main = require('./src/configs/seed')
const app = express();
const PORT = process.env.PORT || 3000;



// Security middleeares for headers
app.use(helmet());
app.use(rateLimit({
    windowMs : 15*60*1000,
    limit : 100
}))


// cors
app.use(cors({
    origin :process.env.URL,
    credentials : true,
    
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({extends:true}));
app.use(cookieParser())

// router.use('/api-docs', swaggerUi.serve);
// router.get('/api-docs', swaggerUi.setup(swaagerDoc));

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));
// Any static files
app.use('/uploads',express.static(UPLOADS_DIR));

SetUploadsPath();

// Routes
app.use('/api',authRouts);
app.use('/api',studentRouts);
app.use('/api',doctorRouts);
app.use('/api',courseLectureRouts);
app.use('/api',researchRouts);
app.use('/api',examRouts);
app.use('/api',degreeRouts);
app.use('/api',fileRouts);
app.use('/api',coreRouts);


// Generate default data to database ones it running
async function defaultDataGeneration(){
    try{
        await main();
        console.log('seed run successfully')
    }catch(error){
        console.error('seed errors : '.error.message)
    }
}
defaultDataGeneration();

app.listen(PORT,()=>{
    console.log(`Server now is running on port ${PORT}`)
})