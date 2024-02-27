import { tanstackBuildConfig } from "@tanstack/config/build";
import { defineConfig, mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      exclude: ["src/index.ts", "src/valid-fields.ts", "src/factories/get-fields-function.ts"],
    },
  },
});

export default mergeConfig(
  config,
  tanstackBuildConfig({
    entry: "./src/index.ts",
    srcDir: "./src",
  }),
);
