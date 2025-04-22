// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  // Use V8 for faster coverage
  coverageProvider: 'v8',

  // Collect coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text-summary',
    'cobertura',
    'lcov'
  ],

  // Resolve your TS/JS aliases and mock UI lib
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
    "^@edifice\\.io/react$": "<rootDir>/src/tests/mocks/edificeReact.tsx",
    "^@cgi-learning-hub/theme$": "<rootDir>/src/tests/mocks/cgiTheme.tsx",
    "^@cgi-learning-hub/ui$": "<rootDir>/node_modules/@cgi-learning-hub/ui/dist/index.d.ts",
    // static assets
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Pass options to your environment constructor
  testEnvironmentOptions: {
    customExportConditions: [''],
  },

  // Which files are considered test specs
  testRegex: ['\\.spec\\.[jt]sx?$'],

  // Transform TypeScript and JS
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.app.json",
      },
    ],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // Recognize these extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}

export default config
