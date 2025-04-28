export const testEnvironment = "jsdom";
export const setupFilesAfterEnv = ["<rootDir>/jest.setup.js"];
export const moduleNameMapper = {
  "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  "^@/(.*)$": "<rootDir>/$1",
};
export const transform = {
  "^.+\\.(ts|tsx)$": [
    "ts-jest",
    {
      tsconfig: "tsconfig.json",
    },
  ],
};
