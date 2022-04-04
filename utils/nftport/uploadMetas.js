const path = require("path");
const basePath = process.cwd();
const fs = require("fs");
const FormData = require('form-data');

const { RateLimit } = require("async-sema");
const { fetchWithRetry } = require(`${basePath}/utils/functions/fetchWithRetry.js`);

const { LIMIT, GENERIC } = require(`${basePath}/src/config.js`);
const _limit = RateLimit(LIMIT);

const allMetadata = [];
const regex = new RegExp("^([0-9]+).json$");
let genericUploaded = false;

if (!fs.existsSync(path.join(`${basePath}/build`, "/ipfsMetas"))) {
  fs.mkdirSync(path.join(`${basePath}/build`, "ipfsMetas"));
}

let readDir = `${basePath}/build/json`;
let writeDir = `${basePath}/build/ipfsMetas`;

async function main() {
  console.log(`Starting upload of ${GENERIC ? genericUploaded ? 'generic ' : '' : ''}metadata...`);

  let formData = new FormData();
  let jsonArray = [];
  fs.readdirSync(readDir).forEach(file => {
      if(!regex.test(file)) {
        return;
      }
      const fileData = fs.createReadStream(`${readDir}/${file}`);
      // jsonArray.push(fileData);
      formData.append("metadata_files", fileData);
      console.log(`${file} metadata added!`);
  });

  console.log(`request: ${formData}`);

  await _limit();
  const url = "https://api.nftport.xyz/v0/metadata/directory";
  const options = {
    method: "POST",
    headers: {},
    body: formData,
  };

  const response = await fetchWithRetry(url, options);

  console.log(`response: ${response}`);
  console.log("metadata uploaded!");

  fs.readdirSync(readDir).forEach(file => {
    if(!regex.test(file)) {
      return;
    }
    let jsonFile = fs.readFileSync(`${readDir}/${file}`);
    let metaData = JSON.parse(jsonFile);
    metaData.metadata_uri = `${response.metadata_directory_ipfs_uri}${file}`;
    // metaData.response = `${response.response}`;
    // delete metaData["file_url"];

    fs.writeFileSync(`${writeDir}/${file}`, JSON.stringify(metaData, null, 2));

    allMetadata.push(metaData);
    console.log(`${file} metadata updated!`);
  });
  
  fs.writeFileSync(`${writeDir}/_ipfsMetas.json`, JSON.stringify(allMetadata, null, 2));

}

main();
