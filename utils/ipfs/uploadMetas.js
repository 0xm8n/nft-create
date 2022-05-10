const path = require("path");
const basePath = process.cwd();
const fs = require("fs");
const request = require('request');

const { AUTH } = require(`${basePath}/src/config.js`);
const regex = new RegExp("^([0-9]+).json$");

let readDir = `${basePath}/build/json`;

function getFileStreamForJSONFiles(directory) {
const jsonArray = []
fs.readdirSync(directory).forEach(file => {
    if(!regex.test(file)) {
    return
    }
    const fileData = fs.createReadStream(path.join(directory, file));
    jsonArray.push(fileData)
});
return jsonArray
}

function sendRequest(metadataFileStreams, apiKey) {
    const options = {
        url: "https://api.nftport.xyz/v0/metadata/directory",
        headers: { 
            "Authorization": apiKey,
            "Content-Type": "multipart/form-data",
        }
    }
    const req = request.post(options, function (err, resp, body) {
        if (err) {
            console.error('Error: ' + err);
        } else {
            console.log('Response: ' + body);
            return resp;
        }
    });
    const form = req.form();
    metadataFileStreams.forEach(file => {
        form.append('metadata_files', file);
    })
}

metadataFileStreams = getFileStreamForJSONFiles(readDir)
sendRequest(metadataFileStreams, AUTH)
