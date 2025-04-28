/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/'],
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage/app-foro',
  coverageReporters: ['html','lcovonly','text-summary'],
  moduleFileExtensions: ['ts','js','html','json']
};
