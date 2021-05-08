// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import serve from "rollup-plugin-serve";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

const dev = "development";
const prod = "production";

function parseNodeEnv(nodeEnv) {
  if (nodeEnv === prod || nodeEnv === dev) {
    return nodeEnv;
  }
  return dev;
}

const nodeEnv = parseNodeEnv(process.env.NODE_ENV);
console.log("Found Node Env: ", nodeEnv);

const plugins = [
  typescript(),
  replace({
    // The react sources include a reference to process.env.NODE_ENV so we need to replace it here with the actual value
    "process.env.NODE_ENV": JSON.stringify(nodeEnv)
  }),
  postcss({
    extract: false,
    writeDefinitions: true,
    modules: true,
    namedExports: true,
    plugins: [autoprefixer()]
  }),
  resolve(),
  commonjs({
    include: "node_modules/**"
  })
];

if (nodeEnv === dev) {
  // For playing around with just frontend code the serve plugin is pretty nice.
  // We removed it when we started doing actual backend work.
  plugins.push(serve("public"));
}

export default {
  input: "src/index.tsx",
  output: {
    dir: "public",
    format: "esm",
    sourcemap: true
  },
  plugins: plugins
};
