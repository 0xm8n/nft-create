const basePath = process.cwd();
const fs = require("fs");

const allMetadata = [];
const regexMeta = new RegExp("^([0-9]+).json$");
let writeDir = `${basePath}/build/json`;

async function main() {

  // const ipfs_folder = "";
  const ipfs_gateway = "https://gateway.pinata.cloud/ipfs/QmTou9CrJtJHZkyBYsBqdKTspz2iBgPi3ngjGwicyK1VwQ";
  fs.readdirSync(writeDir).forEach(file => {
    if(!regexMeta.test(file)) {
      return;
    }
    let jsonFile = fs.readFileSync(`${writeDir}/${file}`);
    let metaData = JSON.parse(jsonFile);
    metaData.image = ipfs_gateway+"/"+file.split(".")[0]+".png";
    
    if(metaData.custom_fields != null){
      metaData.id = metaData.custom_fields.edition;
      delete metaData["name"];
      delete metaData["custom_fields"];
    }

    fs.writeFileSync(`${writeDir}/${file}`, JSON.stringify(metaData, null, 2));

    allMetadata.push(metaData);
    console.log(`${file} metadata updated!`);
  });
  
  fs.writeFileSync(`${writeDir}/metadata.json`, JSON.stringify(allMetadata, null, 2));
}

main();
