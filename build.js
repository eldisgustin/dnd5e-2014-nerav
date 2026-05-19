import fg from "fast-glob";
import merge from "lodash/merge.js";
import template from "lodash/template.js";
import fs from "fs-extra";

const files = await fg("data/**/*.json", { cwd: process.cwd() });
const base = await JSON.parse(fs.readFileSync("base.json").toString());

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(file).toString());

  delete content["$schema"];

  merge(base, content);
}

delete base["$schema"];

const output = JSON.stringify(base);
const t = template(output);
const compiled = t({ version: process.env.RELEASE_VERSION.replace("v", "") });

console.log("writting file");

fs.outputFileSync("dist/output.json", compiled);
