import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import * as tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", "coverage", "prettier.config.cjs", "eslint.config.js", "vite.config.ts", "src/tests/jest/jest.polyfills.js"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  prettierConfig,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: ["./tsconfig.json", "./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react: reactPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "max-depth": ["error", 3],
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-misused-spread": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
      "react-refresh/only-export-components": "off",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/restrict-template-expressions": "off",
      // Règle Prettier
      "prettier/prettier": ["warn"],

      // Règles de nommage
      "@typescript-eslint/naming-convention": [
        "warn",
        // Composants React (toutes les fonctions en PascalCase)
        {
          selector: "function",
          format: ["PascalCase", "camelCase"],
          leadingUnderscore: "allow",
        },
        // Interfaces en PascalCase avec préfixe I
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        // Types en PascalCase
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        // Enums en PascalCase
        {
          selector: "enum",
          format: ["PascalCase"],
        },
        // Règle pour forcer les clés des enums à être en UPPER_CASE
        {
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },
        // Variables standards
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        // Variables booléennes avec préfixes is/has/show
        {
          selector: "variable",
          types: ["boolean"],
          format: null,
          filter: {
            regex: "^(is|has|show)[A-Za-z].*$",
            match: true,
          },
        },
        // Paramètres des fonctions
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        // Paramètres booléens des fonctions
        {
          selector: "parameter",
          types: ["boolean"],
          format: null,
          filter: {
            regex: "^(is|has|show)[A-Za-z].*$",
            match: true,
          },
        },
        // Méthodes
        {
          selector: "method",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        // Hooks personnalisés (use*)
        {
          selector: "function",
          filter: {
            regex: "^use[A-Z]",
            match: true,
          },
          format: ["camelCase"],
        },
        // Arrays avec suffixe List/Array/s
        {
          selector: ["variable", "parameter", "property"],
          types: ["array"],
          format: ["camelCase"],
          suffix: ["List", "s"],
          filter: {
            regex: "^(?!(acc|response|data|body|_|children)$).*",
            match: true,
          },
        },
        // Règle pour toutes les propriétés qui ne sont pas des sélecteurs CSS
        {
          selector: "property",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          filter: {
            regex: "^((&|:|@|#|\\.|-|>|\\+|~|\\[|\\]|\\$).*$|.*\\..*$)",
            match: false,
          },
        },
        // Règle spécifique pour les propriétés booléennes non-CSS
        {
          selector: "property",
          types: ["boolean"],
          format: null,
          filter: {
            regex: "^(is|has|show)[A-Za-z].*$",
            match: true,
          },
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json", "./tsconfig.app.json", "./tsconfig.node.json"],
        },
      },
    },
  },
);
