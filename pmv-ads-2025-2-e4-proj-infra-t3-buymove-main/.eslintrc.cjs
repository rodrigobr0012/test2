/* eslint-env node */
module.exports = {
  env: { browser: true, es2022: true },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended", "prettier"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react", "react-hooks"],
  settings: { react: { version: "18.0" } },
  rules: { "react/prop-types": "off" }
};
