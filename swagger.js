const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Base Node API Documentation',
      version: '1.0.0',
      description: 'API documentation for Base Node project',
    },
    servers: [
      {
        url: `http://localhost:${process.env.SERVER_PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./Controllers/**/*.js'], // 指定要掃描的文件路徑
};

const specs = swaggerJsdoc(options);

module.exports = specs; 