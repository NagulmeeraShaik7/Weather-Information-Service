import WeatherController from '../controllers/weather.controller.mjs';
import fetchWeather from '../usecases/weather.usecase.mjs';

// Mock the fetchWeather usecase
jest.mock('../usecases/weather.usecase.mjs');

describe('WeatherController', () => {
  let req, res;

  beforeEach(() => {
    // Mock request and response objects
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getWeather', () => {
    it('should return weather data for a valid city', async () => {
      // Arrange
      req.params = { city: 'London' };
      const weatherData = {
        city: 'London',
        temperature: 15,
        description: 'Partly cloudy',
        humidity: 70,
        timestamp: new Date(),
      };
      fetchWeather.getWeather.mockResolvedValue(weatherData);

      // Act
      await WeatherController.getWeather(req, res);

      // Assert
      expect(fetchWeather.getWeather).toHaveBeenCalledWith('London');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(weatherData);
    });

    it('should return 400 if city is missing', async () => {
      // Arrange
      req.params = {}; // No city provided

      // Act
      await WeatherController.getWeather(req, res);

      // Assert
      expect(fetchWeather.getWeather).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'City name is required' });
    });

    it('should return 404 if weather data is not found', async () => {
      // Arrange
      req.params = { city: 'London' };
      const error = new Error('No weather data found for this city');
      fetchWeather.getWeather.mockRejectedValue(error);

      // Act
      await WeatherController.getWeather(req, res);

      // Assert
      expect(fetchWeather.getWeather).toHaveBeenCalledWith('London');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No weather data found for this city' });
    });
  });

  describe('postWeather', () => {
    it('should fetch and save weather data for a valid city', async () => {
      // Arrange
      req.body = { city: 'London' };
      const weatherData = {
        city: 'London',
        temperature: 15,
        description: 'Partly cloudy',
        humidity: 70,
      };
      fetchWeather.execute.mockResolvedValue(weatherData);

      // Act
      await WeatherController.postWeather(req, res);

      // Assert
      expect(fetchWeather.execute).toHaveBeenCalledWith('London');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(weatherData);
    });

    it('should return 400 if city is missing', async () => {
      // Arrange
      req.body = {}; // No city provided

      // Act
      await WeatherController.postWeather(req, res);

      // Assert
      expect(fetchWeather.execute).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'City name is required' });
    });

    it('should return 500 if fetching or saving weather data fails', async () => {
      // Arrange
      req.body = { city: 'London' };
      const error = new Error('Failed to fetch weather data');
      fetchWeather.execute.mockRejectedValue(error);

      // Act
      await WeatherController.postWeather(req, res);

      // Assert
      expect(fetchWeather.execute).toHaveBeenCalledWith('London');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch weather data' });
    });
  });
});