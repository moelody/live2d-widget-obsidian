import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"

import { terser } from "rollup-plugin-terser"
import webWorker from "rollup-plugin-web-worker-loader";

const isProd = process.env.BUILD === "production"

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/
`

let plugins = [
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
    json(),
    webWorker({ inline: true, forceInline: true, targetPlatform: "browser" })
]
if (isProd) plugins.push(terser())

export default {
    input: "src/main.ts",
    output: {
        dir: ".",
        sourcemap: "inline",
        sourcemapExcludeSources: isProd,
        format: "cjs",
        exports: "default",
        banner
    },
    external: ["obsidian"],
    plugins: plugins,
    onwarn: (warning, warn) => {
        // Sorry rollup, but we're using eval...
        if (/Use of eval is strongly discouraged/.test(warning.message)) return;
        warn(warning);
    },
}
