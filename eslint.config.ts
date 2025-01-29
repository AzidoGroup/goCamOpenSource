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
      "@typescript-eslint/no-explicit-any": "off", // turn this back to `warn`
      "@typescript-eslint/no-namespace": "off",
      "@stylistic/no-tabs": ["warn", { allowIndentationTabs: true }],
      // "@stylistic/indent": ["error", 2],
      // "@stylistic/quotes": ["error", "single"],
      "@stylistic/max-len": ["error", { code: 260 }],

      // remove these rules after figuring out what's broken
      "@stylistic/ts/comma-dangle": "off",
      "@typescript-eslint/prefer-namespace-keyword": "off", //fixable?
      "no-prototype-builtins": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-unsafe-function-type": "off", // unfixable
      "prefer-const": "off",
      "no-var": "off"
    },
  }
);
