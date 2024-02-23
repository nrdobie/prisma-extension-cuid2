import { tanstackBuildConfig } from "@tanstack/config/build";
import { defineConfig, mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {},
  },
});

export default mergeConfig(
  config,
  tanstackBuildConfig({
    entry: "./src/index.ts",
    srcDir: "./src",
  }),
);
