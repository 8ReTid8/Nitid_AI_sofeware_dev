// lib/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
    },
  },
  apis: ['./pages/api/**/*.ts'], // or './app/api/**/*.ts' if you're using App Router
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
