import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["app", "node_modules", "script", "example"],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["source/**/*.ts"],
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "single"],
    },
  }
);
