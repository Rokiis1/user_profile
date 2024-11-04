import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  // ESLint recommended configuration
  pluginJs.configs.recommended,

  // Prettier recommended configuration
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      "prettier/prettier": "error",
    },
  },

  // Custom configuration
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2020,
      sourceType: "module",
    },
    plugins: {
      import: pluginJs,
    },
    rules: {
      "no-console": "off",
      eqeqeq: "error",
      curly: "error",
      "comma-dangle": ["error", "always-multiline"],
      "comma-spacing": ["error", { before: false, after: true }],
      "comma-style": ["error", "last"],
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "object-curly-spacing": ["error", "always"],
    },
  },
];
