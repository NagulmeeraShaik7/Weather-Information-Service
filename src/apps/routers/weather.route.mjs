import express from 'express';
import weatherController from '../controllers/weather.controller.mjs';
import authenticate from '../../middleware/auth.middleware.mjs';

const router = express.Router();

/**
 * @swagger
 * /api/weather:
 *   post:
 *     summary: Fetch and save weather data for a city
 *     tags: [Weather]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *             properties:
 *               city:
 *                 type: string
 *                 description: The name of the city to fetch weather data for
 *                 example: London
 *     responses:
 *       200:
 *         description: Weather data fetched and saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                   example: London
 *                 temperature:
 *                   type: number
 *                   example: 15
 *                 description:
 *                   type: string
 *                   example: Partly cloudy
 *                 humidity:
 *                   type: number
 *                   example: 70
 *       400:
 *         description: City name is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: City name is required
 *       401:
 *         description: Unauthorized, invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Authentication token required
 *       500:
 *         description: Server error or failed to fetch weather data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch weather data
 */
router.post('/', authenticate, weatherController.postWeather);

/**
 * @swagger
 * /api/weather/{city}:
 *   get:
 *     summary: Retrieve weather data for a city
 *     tags: [Weather]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the city to retrieve weather data for
 *         example: London
 *     responses:
 *       200:
 *         description: Weather data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                   example: London
 *                 temperature:
 *                   type: number
 *                   example: 15
 *                 description:
 *                   type: string
 *                   example: Partly cloudy
 *                 humidity:
 *                   type: number
 *                   example: 70
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-05-31T15:31:00.000Z
 *       400:
 *         description: City name is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: City name is required
 *       401:
 *         description: Unauthorized, invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Authentication token required
 *       404:
 *         description: No weather data found for the city
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No weather data found for this city
 */
router.get('/:city', authenticate, weatherController.getWeather);

export default router;