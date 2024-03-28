import { getBanner } from "./userscript.js";
import fs from "fs";
import esbuild from "esbuild";
import JsConfuser from "js-confuser";
import chalk from "chalk";
import { parseArgs } from "util"
import { program } from "commander";
import CSSModulesPlugin from "esbuild-css-modules-plugin";

program.name(chalk.bold("RevoltEdge Build Tool"))
.description(chalk.yellow("Builds the RevoltEdge userscript"))
.option('--dev', "Builds the userscript without obfuscation")

program.parse();

async function build() {
  try {
    let config = fs.readFileSync("./userscript.json", "utf8");

    let banner = getBanner(JSON.parse(config), true);

    await esbuild.build({
      metafile: true,
      sourcemap: false,
      target: ["chrome100"],
      format: "esm",
      entryPoints: ["./src/index.ts"],
      bundle: true,
      minify: false,
      outfile: "./dist/Revolt.user.js",
      logLevel: "error",
    });

    console.log(chalk.green("ESBuild completed!"));

    let contents = fs.readFileSync("./dist/Revolt.user.js", "utf-8");
    const options = program.opts();
    if (!options.dev) {
      console.log(chalk.yellow("Obfuscating..."));
      let obfuscated = await JsConfuser.obfuscate(contents, {
        calculator: true,
        compact: true,
        controlFlowFlattening: 0.25,
        dispatcher: 0.5,
        duplicateLiteralsRemoval: 0.5,
        flatten: true,
        hexadecimalNumbers: true,
        identifierGenerator: 'randomized',
        lock: {
          selfDefending: true,
          browserLock: [
            'chrome',
          ],
          antiDebug: false,
        },
        minify: true,
        movedDeclarations: true,
        objectExtraction: true,
        opaquePredicates: 0.5,
        renameVariables: true,
        rgf: true,
        shuffle: 'true',
        stack: 0.5,
        stringCompression: true,
        stringConcealing: true,
        stringEncoding: true,
        stringSplitting: 0.25,
        target: 'browser',
      });
      fs.writeFileSync("./dist/Revolt.user.js", banner + "\n");
      fs.appendFileSync("./dist/Revolt.user.js", obfuscated.toString());
      console.log(chalk.green("Obfuscation complete!"));
    } else {
      fs.writeFileSync("./dist/Revolt.user.js", banner + "\n");
      fs.appendFileSync("./dist/Revolt.user.js", "\n" + contents.toString());

    }

    console.log(chalk.green("Revolt built successfully!"));
  } catch (err) {
    console.log(chalk.red("Revolt encountered a fatal error while building!"));
    console.error(err)
  }
}

build();