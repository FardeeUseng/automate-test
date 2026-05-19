import nextJest from "next/jest";
import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  testMatch: [
    "**/__tests__/**/*.(spec|test).(ts|tsx)",
    "**/*.(spec|test).(ts|tsx)",
  ],

  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "utils/**/*.{ts,tsx}",
    "!**/*.d.ts",
  ],
};

export default createJestConfig(config);
