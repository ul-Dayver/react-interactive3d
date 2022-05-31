import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const packageJson = require("./package.json");
const umdGlobals = { react: "React" };
export default [
  { 
    input: "src/index.tsx",
    output: [
      {
        file: packageJson.main,
        format: "umd",
        name: "reactInteractive3D",
        globals: umdGlobals,
        sourcemap: "inline",
        exports: "named",
      },
      {
        file: packageJson.module,
        format: "es",
        sourcemap: true,
      }
    ],
    external: Object.keys(umdGlobals),
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
    ],
  },
  {
    input: "dist/es/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  }
];