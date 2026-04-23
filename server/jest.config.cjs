/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|js)$": "babel-jest",
  },
  // Transform workspace-linked `shared/dist` (not under `node_modules/` when resolved); skip the rest of node_modules.
  transformIgnorePatterns: ["/node_modules/"],
};
