import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Legacy JavaScript copied from the Angular public assets.
    // These files are served as static assets and are not part
    // of the Next.js application source.
    "public/assets/js/**",
  ]),
]);

export default eslintConfig;