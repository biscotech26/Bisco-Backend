const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const fs = require("fs");
const schemas = require("../docs/schemas");

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
                title: 'API Documentation',
                version: '1.0.0',
                description: 'Bisco backend API documentation',
        },
        contact: {
                name: 'Bisco',
        },

        servers: [
            {
                url: 'http:localhost:5000',
                description: 'local server',
            },
            {
                url: process.env.PRODUCTION_URL,
                description: "Production server",
            },
        ],

        tags: [
            { name: 'Inquiries', description: 'API for project inquiries and contact form submissions from the company website'}
        ],

        components: {
        schemas,
        },
    },

     // Scan the documentation files
    apis: [
        path.resolve(__dirname, "../docs/*.js").replace(/\\/g, "/"),
    ]
};


const swaggerSpec = swaggerJsdoc(options);

console.log("Swagger documentation files:", options.apis);
console.log("Detected paths:", Object.keys(swaggerSpec.paths || {}));

module.exports = swaggerSpec;
