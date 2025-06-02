import FetchWeather from '../usecases/weather.usecase.mjs';
import weatherRepository from '../repositories/weather.repository.mjs';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock dependencies
jest.mock('../repositories/weather.repository.mjs');
const mockAxios = new MockAdapter(axios);

describe('FetchWeather', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
    process.env.WEATHERSTACK_API_KEY = 'test_api_key';
  });

  describe('execute', () => {
    it('should fetch and save weather data for a valid city', async () => {
      // Arrange
      const city = 'London';
      const apiResponse = {
        location: { name: 'London' },
        current: {
          temperature: 15,
          weather_descriptions: ['Partly cloudy'],
          humidity: 70,
        },
      };
      const expectedWeatherData = {
        city: 'London',
        temperature: 15,
        description: 'Partly cloudy',
        humidity: 70,
      };
      mockAxios
        .onGet(`http://api.weatherstack.com/current?access_key=test_api_key&query=${city}`)
        .reply(200, apiResponse);
      weatherRepository.saveWeatherData.mockResolvedValue(expectedWeatherData);

      // Act
      const result = await FetchWeather.execute(city);

      // Assert
      expect(mockAxios.history.get.length).toBe(1);
      expect(weatherRepository.saveWeatherData).toHaveBeenCalledWith(expectedWeatherData);
      expect(result).toEqual(expectedWeatherData);
    });

    it('should throw an error if the API returns an error', async () => {
      // Arrange
      const city = 'InvalidCity';
      const apiResponse = { error: { info: 'City not found' } };
      mockAxios
        .onGet(`http://api.weatherstack.com/current?access_key=test_api_key&query=${city}`)
        .reply(200, apiResponse);

      // Act & Assert
      await expect(FetchWeather.execute(city)).rejects.toThrow('Failed to fetch weather data: City not found');
      expect(weatherRepository.saveWeatherData).not.toHaveBeenCalled();
    });

    it('should throw an error if the API request fails', async () => {
      // Arrange
      const city = 'London';
      mockAxios
        .onGet(`http://api.weatherstack.com/current?access_key=test_api_key&query=${city}`)
        .reply(500, { message: 'Server error' });

      // Act & Assert
      await expect(FetchWeather.execute(city)).rejects.toThrow('Failed to fetch weather data: Request failed with status code 500');
      expect(weatherRepository.saveWeatherData).not.toHaveBeenCalled();
    });

    it('should throw an error if saving to the database fails', async () => {
      // Arrange
      const city = 'London';
      const apiResponse = {
        location: { name: 'London' },
        current: {
          temperature: 15,
          weather_descriptions: ['Partly cloudy'],
          humidity: 70,
        },
      };
      mockAxios
        .onGet(`http://api.weatherstack.com/current?access_key=test_api_key&query=${city}`)
        .reply(200, apiResponse);
      weatherRepository.saveWeatherData.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(FetchWeather.execute(city)).rejects.toThrow('Failed to fetch weather data: Database error');
    });
  });

  describe('getWeather', () => {
    it('should return the most recent weather data for a city', async () => {
      // Arrange
      const city = 'London';
      const weatherData = {
        city: 'London',
        temperature: 15,
        description: 'Partly cloudy',
        humidity: 70,
        timestamp: new Date(),
      };
      weatherRepository.getWeatherByCity.mockResolvedValue(weatherData);

      // Act
      const result = await FetchWeather.getWeather(city);

      // Assert
      expect(weatherRepository.getWeatherByCity).toHaveBeenCalledWith('London');
      expect(result).toEqual(weatherData);
    });

    it('should throw an error if no weather data is found', async () => {
      // Arrange
      const city = 'London';
      weatherRepository.getWeatherByCity.mockResolvedValue(null);

      // Act & Assert
      await expect(FetchWeather.getWeather(city)).rejects.toThrow('No weather data found for this city');
      expect(weatherRepository.getWeatherByCity).toHaveBeenCalledWith('London');
    });

    it('should throw an error if the database query fails', async () => {
      // Arrange
      const city = 'London';
      const error = new Error('Database query error');
      weatherRepository.getWeatherByCity.mockRejectedValue(error);

      // Act & Assert
      await expect(FetchWeather.getWeather(city)).rejects.toThrow('Database query error');
      expect(weatherRepository.getWeatherByCity).toHaveBeenCalledWith('London');
    });
  });
});