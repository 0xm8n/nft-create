const basePath = process.cwd();
const fs = require("fs");

const allMetadata = [];
const regexMeta = new RegExp("^([0-9]+).json$");
let writeDir = `${basePath}/build/json`;

async function main() {

  const ipfs_folder = "QmQR4xnjPRgkcn8eomC1A8FmRyWpaqXAfwE6MqDovZv766";
  const ipfs_gateway = "https://ipfs.io";
  fs.readdirSync(writeDir).forEach(file => {
    if(!regexMeta.test(file)) {
      return;
    }
    let jsonFile = fs.readFileSync(`${writeDir}/${file}`);
    let metaData = JSON.parse(jsonFile);
    metaData.image = ipfs_gateway+"/ipfs/"+ipfs_folder+"/"+file.split(".")[0]+".png";
    // delete metaData["file_url"];
    // delete metaData.custom_fields["compiler"];

    fs.writeFileSync(`${writeDir}/${file}`, JSON.stringify(metaData, null, 2));

    allMetadata.push(metaData);
    console.log(`${file} metadata updated!`);
  });
  
  fs.writeFileSync(`${writeDir}/_metadata.json`, JSON.stringify(allMetadata, null, 2));
}

main();
