import WeatherRepository from '../repositories/weather.repository.mjs';
import Weather from '../models/weather.model.mjs';

// Mock the Weather model
jest.mock('../models/weather.model.mjs');

describe('WeatherRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveWeatherData', () => {
    it('should save weather data and return the saved document', async () => {
      // Arrange
      const weatherData = {
        city: 'Paris',
        temperature: 20,
        description: 'Sunny',
        humidity: 65,
      };
      const mockSavedDoc = { ...weatherData, _id: 'weather123', timestamp: new Date() };
      const weatherInstance = { save: jest.fn().mockResolvedValue(mockSavedDoc) };
      Weather.mockReturnValue(weatherInstance);

      // Act
      const result = await WeatherRepository.saveWeatherData(weatherData);

      // Assert
      expect(Weather).toHaveBeenCalledWith(weatherData);
      expect(weatherInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockSavedDoc);
    });

    it('should throw an error if saving fails', async () => {
      // Arrange
      const weatherData = {
        city: 'Paris',
        temperature: 20,
        description: 'Sunny',
        humidity: 65,
      };
      const error = new Error('Database save error');
      const weatherInstance = { save: jest.fn().mockRejectedValue(error) };
      Weather.mockReturnValue(weatherInstance);

      // Act & Assert
      await expect(WeatherRepository.saveWeatherData(weatherData)).rejects.toThrow('Database save error');
      expect(Weather).toHaveBeenCalledWith(weatherData);
      expect(weatherInstance.save).toHaveBeenCalled();
    });
  });

  describe('getWeatherByCity', () => {
    it('should return the most recent weather data', async () => {
      // Arrange
      const city = 'Paris';
      const mockWeatherData = {
        city: 'Paris',
        temperature: 20,
        description: 'Sunny',
        humidity: 65,
        timestamp: new Date(),
      };
      Weather.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockWeatherData),
      });

      // Act
      const result = await WeatherRepository.getWeatherByCity(city);

      // Assert
      expect(Weather.findOne).toHaveBeenCalledWith({ city: 'Paris' });
      expect(Weather.findOne().sort).toHaveBeenCalledWith({ timestamp: -1 });
      expect(result).toEqual(mockWeatherData);
    });

    it('should return null if no data is found', async () => {
      // Arrange
      const city = 'Paris';
      Weather.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      });

      // Act
      const result = await WeatherRepository.getWeatherByCity(city);

      // Assert
      expect(Weather.findOne).toHaveBeenCalledWith({ city: 'Paris' });
      expect(Weather.findOne().sort).toHaveBeenCalledWith({ timestamp: -1 });
      expect(result).toBeNull();
    });

    it('should throw an error if the database query fails', async () => {
      // Arrange
      const city = 'Paris';
      const error = new Error('Database query error');
      Weather.findOne.mockReturnValue({
        sort: jest.fn().mockRejectedValue(error),
      });

      // Act & Assert
      await expect(WeatherRepository.getWeatherByCity(city)).rejects.toThrow('Database query error');
      expect(Weather.findOne).toHaveBeenCalledWith({ city: 'Paris' });
      expect(Weather.findOne().sort).toHaveBeenCalledWith({ timestamp: -1 });
    });
  });
});