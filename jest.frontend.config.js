module.exports = {
  // name displayed during tests
  displayName: "frontend",

  // simulates browser environment in jest
  // e.g., using document.querySelector in your tests
  testEnvironment: "jest-environment-jsdom",

  // jest does not recognise jsx files by default, so we use babel to transform any jsx files
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },

  // tells jest how to handle css/scss imports in your tests
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },

  // ignore all node_modules except styleMock (needed for css imports)
  transformIgnorePatterns: ["/node_modules/(?!(styleMock\\.js)$)"],

  // only run these tests
  testMatch: ["<rootDir>/client/src/pages/**/*.test.js", "<rootDir>/client/src/components/**/*.test.js"],

  // jest code coverage
  collectCoverage: true,
  // Adjust the collection the stats you wish to display
  collectCoverageFrom: ["client/src/pages/Auth/**"],
  // Kenneth MS1
  // collectCoverageFrom: [
  //   "client/src/components/Form/CategoryForm.js",
  //   "client/src/components/AdminMenu.js",
  //   "client/src/pages/admin/**",
  //   "client/src/pages/HomePage.js",
  // ],
  // Else
  // collectCoverageFrom: ["client/src/pages/Auth/**", "client/src/context/**","client/src/pages/CartPage.js"],
  coverageThreshold: {
    global: {
      lines: 100,
      functions: 100,
    },
  },
};
