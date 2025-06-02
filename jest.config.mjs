export default {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'mjs'],
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
  testMatch: ['**/*.test.mjs'],
  setupFiles: ['dotenv/config'],
};