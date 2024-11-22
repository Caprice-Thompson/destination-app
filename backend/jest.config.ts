export default {
    rootDir: "./",
    roots: ["<rootDir>/tests"],
    transform: {
      "^.+\\.ts?$": "ts-jest",
    },
    clearMocks: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    testMatch: ["**/*.test.ts"],
    passWithNoTests: true,
  };