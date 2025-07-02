/** @format */
import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/tests/**/*.test.ts'],
	setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
	clearMocks: true,
	resetModules: true,
};

export default config;
