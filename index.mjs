import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import weatherRoutes from './src/apps/routers/weather.route.mjs';
import authRoutes from './src/apps/routers/auth.route.mjs';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './src/config/swagger.config.mjs';

/**
 * @module index
 * @description Main entry point for the Weather API application, setting up the Express server, middleware, routes, and MongoDB connection.
 */

/**
 * Loads environment variables from the .env file.
 * @function
 */
dotenv.config();

/**
 * @constant {Object} app - The Express application instance.
 */
const app = express();

/**
 * Middleware to parse JSON request bodies.
 * @function
 */
app.use(express.json());

/**
 * Sets up Swagger UI for API documentation.
 * @description Serves the Swagger UI at /api-docs using the provided Swagger configuration.
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * Connects to the MongoDB database using the MONGODB_URI from environment variables.
 * @description Logs a success message on connection or an error message on failure.
 * @returns {Promise<void>} Resolves when the connection is established or rejects with an error.
 */
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

/**
 * Registers API routes for weather and authentication endpoints.
 * @description Mounts the weather routes at /api/weather and auth routes at /api/auth.
 */
app.use('/api/weather', weatherRoutes);
app.use('/api/auth', authRoutes);

/**
 * @constant {number} PORT - The port on which the server runs, defaults to 3000 if not specified in environment variables.
 */
const PORT = process.env.PORT || 3000;

/**
 * Starts the Express server.
 * @description Listens on the specified PORT and logs the server status and Swagger UI URL.
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});