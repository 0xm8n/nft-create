const basePath = process.cwd();
const fs = require("fs");
const {
  GENERIC_TITLE,
  GENERIC_DESCRIPTION,
  GENERIC_IMAGE,
} = require(`${basePath}/src/config.js`);

const buildDir = `${basePath}/build`;
const genericDir = `${buildDir}/genericJson`;
const readDir = `${buildDir}/json`;

if (!fs.existsSync(genericDir)) {
  fs.mkdirSync(genericDir);
}

let rawdata = fs.readFileSync(`${readDir}/1.json`);
let data = JSON.parse(rawdata);

console.log("Starting generic metadata creation.");

data.name = GENERIC_TITLE;
data.description = GENERIC_DESCRIPTION;
data.image = GENERIC_IMAGE;
delete data.id;
delete data.attributes;
delete data.custom_fields;
data.attributes = [];

fs.writeFileSync(
  `${genericDir}/default.json`,
  JSON.stringify(data, null, 2)
);

console.log("Generic metadata created!");