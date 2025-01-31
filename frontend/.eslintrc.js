module.exports = {
  extends: [
    "react-app",
    "react-app/jest"
  ],
  rules: {
    // Allow JSX without explicit React import (for React 17+)
    "react/react-in-jsx-scope": "off",
    // Fix BigInt warnings
    "no-undef": "off"
  },
  env: {
    // Enable ES2020/BigInt features
    es2020: true,
    browser: true
  }
};
