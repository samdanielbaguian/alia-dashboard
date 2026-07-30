module.exports = {
  displayName: 'alia-dashboard',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    'utils/**/*.{js}',
    'hooks/**/*.{js}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
