const FormData = require("form-data");
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");

const { RateLimit } = require('async-sema');
const { fetchWithRetry } = require(`${basePath}/utils/functions/fetchWithRetry.js`);
const _limit = RateLimit(2);

const allMetadata = [];
const regex = new RegExp("^([0-9]+).png");
const startId = 1;

async function main() {
  console.log("Starting upload of images...");
  const files = fs.readdirSync(`${basePath}/build/images`);
  files.sort(function(a, b){
    return a.split(".")[0] - b.split(".")[0];
  });
  for (const file of files) {
    try {
      if (regex.test(file)) {
        const fileName = path.parse(file).name;
        let jsonFile = fs.readFileSync(`${basePath}/build/json/${fileName}.json`);
        let metaData = JSON.parse(jsonFile);
        
        if(Number.parseInt(fileName) >= startId){
          await _limit()
          const url = "https://api.nftport.xyz/v0/files";
          const formData = new FormData();
          const fileStream = fs.createReadStream(`${basePath}/build/images/${file}`);
          formData.append("file", fileStream);
          const options = {
            method: "POST",
            headers: {},
            body: formData,
          };
          const response = await fetchWithRetry(url, options);
          metaData.image = response.ipfs_url;
          if(metaData.custom_fields != null){
            metaData.id = metaData.custom_fields.edition;
            delete metaData["name"];
            delete metaData["custom_fields"];
          }

          fs.writeFileSync(
            `${basePath}/build/json/${fileName}.json`,
            JSON.stringify(metaData, null, 2)
          );
          console.log(`${response.file_name} uploaded & ${fileName}.json updated!`);
        }
        allMetadata.push(metaData);
      }
    } catch (error) {
      console.log(`Catch: ${error}`);
    }
  }

  fs.writeFileSync(
    `${basePath}/build/json/metadata.json`,
    JSON.stringify(allMetadata, null, 2)
  );
}

main();