import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["app", "node_modules", "script", "example"],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["source/**/*.ts"],
  }
);
