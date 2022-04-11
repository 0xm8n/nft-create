const basePath = process.cwd();
const fs = require("fs");
// const yesno = require('yesno');

const {
  baseUri,
  description,
} = require(`${basePath}/src/config.js`);

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/metadata.json`);
let data = JSON.parse(rawdata);

console.log("Info will be updated using the config.js data.");

data.forEach((item) => {
  item.description = description;
  item.image = `${baseUri}/${item.id}.png`;
 
  fs.writeFileSync(
    `${basePath}/build/json/${item.id}.json`,
    JSON.stringify(item, null, 2)
  );
});

fs.writeFileSync(
  `${basePath}/build/json/metadata.json`,
  JSON.stringify(data, null, 2)
);

console.log(`Updated baseUri for images to ===> ${baseUri}`);
console.log(`Updated description for images to ===> ${description}`);
