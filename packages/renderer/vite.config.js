/* eslint-env node */

import {chrome} from "../../.electron-vendors.cache.json";
import {join} from "node:path";
import {injectAppVersion} from "../../version/inject-app-version-plugin.mjs";
import replace from "@rollup/plugin-replace";


const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, "../..");
const TYPIE_VERSION = process.env.npm_package_version;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
    envDir: PROJECT_ROOT,
    resolve: {
        alias: {
            "/@/": join(PACKAGE_ROOT, "src") + "/",
        },
    },
    base: "",
    server: {
        fs: {
            strict: true,
        },
    },
    watch: {

    },
    build: {
        sourcemap: true,
        target: `chrome${chrome}`,
        outDir: "dist",
        assetsDir: ".",
        rollupOptions: {
            input: {
                index: join(PACKAGE_ROOT, "index.html"),
                canvas: join(PACKAGE_ROOT, "canvas.html"),
            },
            plugins: [
                replace({
                    delimiters: ["", ""],
                    values: {
                        "{%VERSION%}": TYPIE_VERSION,
                    },
                }),
            ],
        },
        emptyOutDir: true,
        reportCompressedSize: false,
    },
    test: {
        environment: "happy-dom",
    },
    plugins: [
        // vue(),
        // renderer.vite({
        //     preloadEntry: join(PACKAGE_ROOT, "../preload/src/index.ts"),
        // }),
        injectAppVersion(),
        replace({
            delimiters: ["", ""],
            values: {
                "{%VERSION%}": process.env.MODE === "development" ? "dev@" + TYPIE_VERSION : TYPIE_VERSION,
            },
        }),
    ],
};

export default config;
