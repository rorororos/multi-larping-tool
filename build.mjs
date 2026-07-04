import { build } from "esbuild";
import { createHash } from "crypto";
import { readFileSync, writeFileSync, mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });

await build({
    entryPoints: ["src/index.js"],
    outfile: "dist/index.js",
    bundle: true,
    minify: false,
    format: "cjs",
    target: "esnext",
    platform: "browser",
    loader: { ".jsx": "jsx" },
    jsx: "automatic",
    jsxImportSource: "react",
    plugins: [
        {
            name: "vendetta-externals",
            setup(build) {
                build.onResolve({ filter: /^@vendetta.*/ }, (args) => ({
                    path: args.path,
                    namespace: "vendetta-external"
                }));
                build.onResolve({ filter: /^react$|^react-native$/ }, (args) => ({
                    path: args.path,
                    namespace: "vendetta-external"
                }));
                build.onLoad({ filter: /.*/, namespace: "vendetta-external" }, (args) => ({
                    contents: `module.exports = vendetta.metro.findByProps ? vendetta : globalThis.vendettaRequire("${args.path}")`,
                    loader: "js"
                }));
            }
        }
    ],
    logLevel: "info"
});

const code = readFileSync("dist/index.js", "utf8");
const hash = createHash("sha256").update(code).digest("hex");

const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
manifest.hash = hash;
writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2));

console.log("build done, hash:", hash);
