import { build } from "esbuild";
import { createHash } from "crypto";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "fs";

mkdirSync("dist", { recursive: true });

await build({
    entryPoints: ["src/index.js"],
    outfile: "dist/index.js",
    bundle: true,
    minify: false,
    format: "iife",
    target: "esnext",
    platform: "browser",
    external: ["@vendetta", "@vendetta/*", "react", "react-native"],
    logLevel: "info",
    loader: { ".jsx": "jsx" },
    jsx: "automatic"
});

const code = readFileSync("dist/index.js", "utf8");
const hash = createHash("sha256").update(code).digest("hex");

const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
manifest.hash = hash;
writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2));

console.log("✅ build done");
console.log("📦 hash:", hash);
