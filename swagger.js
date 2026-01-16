const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'Collage Api',
        version: '1.0.0',
        description: 'API documentation'
        },
        servers: [
        {
            url: 'http://localhost:3000/api'
        }
        ],
        components: {
        securitySchemes: {
            bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
            }
        }
        },
        security: [
        {
            bearerAuth: []
        }
        ]
    },
    apis: [
        './src/modules/auth/routes/authRouts.js',
        './src/modules/students/routes/studentRouts.js',
        './src/modules/doctors/routes/doctorRouts.js',
        './src/modules/courses/routes/courseLEctureRouts.js',
        './src/modules/researchs/researchRouts.js',
        './src/modules/degrees/degreeRouts.js',
        './src/modules/files/filesRouts.js',
         './src/modules/exams/examRouts.js'
    ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
