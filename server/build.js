import { build } from "esbuild";

build({
  entryPoints: ["./index.mjs"],
  bundle: true,
  minify: true,
  platform: "node",
  target: "node16",
  outfile: "./dist/index.js",
  format: "esm",
}).catch(() => process.exit(1));
