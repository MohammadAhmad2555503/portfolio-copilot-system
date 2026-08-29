import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextVitals = require("eslint-config-next/core-web-vitals");
const nextTypescript = require("eslint-config-next/typescript");

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      ".npm-cache/**",
      "node_modules/**",
      "logs/**",
      "next-env.d.ts",
      "apply-agent/**"
    ]
  }
];

export default eslintConfig;

