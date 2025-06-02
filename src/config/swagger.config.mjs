import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger configuration for the Weather API
 * @module swaggerConfig
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Weather API',
      version: '1.0.0',
      description: 'API for fetching and storing weather data with user authentication',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'The unique username of the user',
              example: 'johndoe',
            },
            password: {
              type: 'string',
              description: 'The password for the user (hashed in the database)',
              example: 'password123',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp when the user was created',
              example: '2025-05-31T15:31:00.000Z',
            },
          },
        },
        Weather: {
          type: 'object',
          required: ['city', 'temperature', 'description', 'humidity'],
          properties: {
            city: {
              type: 'string',
              description: 'The name of the city',
              example: 'London',
            },
            temperature: {
              type: 'number',
              description: 'The current temperature in Celsius',
              example: 15,
            },
            description: {
              type: 'string',
              description: 'A description of the current weather',
              example: 'Partly cloudy',
            },
            humidity: {
              type: 'number',
              description: 'The current humidity percentage',
              example: 70,
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp when the weather data was recorded',
              example: '2025-05-31T15:31:00.000Z',
            },
          },
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/apps/routers/*.mjs'], // Path to files with Swagger annotations
};

/**
 * Initialize Swagger JSDoc
 * @returns {object} Swagger specification
 */
const swaggerDocs = swaggerJsdoc(swaggerOptions);

export default swaggerDocs;