import Weather from '../models/weather.model.mjs';

/**
 * @class WeatherRepository
 * @description Repository for handling database operations related to weather data.
 */
class WeatherRepository {
  /**
   * Saves weather data to the database.
   * @async
   * @param {Object} weatherData - The weather data to save.
   * @param {string} weatherData.city - The name of the city.
   * @param {number} weatherData.temperature - The current temperature in Celsius.
   * @param {string} weatherData.description - A description of the current weather.
   * @param {number} weatherData.humidity - The current humidity percentage.
   * @returns {Promise<Object>} The saved weather data document.
   * @throws {Error} If there is an error saving the weather data to the database.
   */
  async saveWeatherData(weatherData) {
    const weather = new Weather(weatherData);
    return await weather.save();
  }

  /**
   * Retrieves the most recent weather data for a specified city.
   * @async
   * @param {string} city - The name of the city to retrieve weather data for.
   * @returns {Promise<Object|null>} The most recent weather data document for the city, or null if not found.
   * @throws {Error} If there is an error querying the database.
   */
  async getWeatherByCity(city) {
    return await Weather.findOne({ city }).sort({ timestamp: -1 });
  }
}

export default new WeatherRepository();