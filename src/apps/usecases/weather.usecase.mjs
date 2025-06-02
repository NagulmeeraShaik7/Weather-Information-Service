import axios from 'axios';
import weatherRepository from '../repositories/weather.repository.mjs';

/**
 * @class FetchWeather
 * @description Usecase for fetching and managing weather data, including retrieving data from an external API and interacting with the database.
 */
class FetchWeather {
  /**
   * Fetches weather data for a specified city from an external API and saves it to the database.
   * @async
   * @param {string} city - The name of the city to fetch weather data for.
   * @returns {Promise<Object>} The weather data object containing city, temperature, description, and humidity.
   * @throws {Error} If the city is invalid, the API request fails, or there is an error saving to the database.
   */
  async execute(city) {
    try {
      const apiKey = process.env.WEATHERSTACK_API_KEY;
      const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
      const response = await axios.get(url);
      //console.log("response---------", response);

      if (response.data.error) {
        throw new Error(response.data.error.info);
      }

      const weatherData = {
        city: response.data.location.name,
        temperature: response.data.current.temperature,
        description: response.data.current.weather_descriptions[0],
        humidity: response.data.current.humidity,
      };
      //console.log("weatherData---------", weatherData);

      // Save to MongoDB
      await weatherRepository.saveWeatherData(weatherData);
      return weatherData;
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }

  /**
   * Retrieves the most recent weather data for a specified city from the database.
   * @async
   * @param {string} city - The name of the city to retrieve weather data for.
   * @returns {Promise<Object>} The most recent weather data document for the city.
   * @throws {Error} If no weather data is found for the city or there is an error querying the database.
   */
  async getWeather(city) {
    const weatherData = await weatherRepository.getWeatherByCity(city);
    if (!weatherData) {
      throw new Error('No weather data found for this city');
    }
    return weatherData;
  }
}

export default new FetchWeather();