import fetchWeather from '../usecases/weather.usecase.mjs';

/**
 * @class WeatherController
 * @description Controller for handling weather-related operations, including fetching and saving weather data.
 */
class WeatherController {
  /**
   * Retrieves weather data for a specified city.
   * @async
   * @param {Object} req - Express request object containing the city name in the parameters.
   * @param {Object} req.params - Request parameters.
   * @param {string} req.params.city - The name of the city to retrieve weather data for.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Responds with a JSON object containing the weather data or an error message.
   * @throws {Error} If the city name is missing or no weather data is found for the city.
   */
  getWeather = async (req, res) => {
    try {
      const { city } = req.params;
      if (!city) {
        return res.status(400).json({ error: 'City name is required' });
      }

      const weatherData = await fetchWeather.getWeather(city);
      res.status(200).json(weatherData);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  /**
   * Fetches and saves weather data for a specified city.
   * @async
   * @param {Object} req - Express request object containing the city name in the body.
   * @param {Object} req.body - Request body containing the city name.
   * @param {string} req.body.city - The name of the city to fetch and save weather data for.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Responds with a JSON object containing the saved weather data or an error message.
   * @throws {Error} If the city name is missing or an error occurs while fetching/saving weather data.
   */
  postWeather = async (req, res) => {
    try {
      const { city } = req.body;
      if (!city) {
        return res.status(400).json({ error: 'City name is required' });
      }

      const weatherData = await fetchWeather.execute(city);
      res.status(200).json(weatherData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

export default new WeatherController();