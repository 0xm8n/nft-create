/**
 * This script will refresh the cache/metadata for all tokens in a collection in the specified contract in opensea.
 *
 * Usage:
 *  - npm install node-fetch
 *  - node openseaRefresh.js > output.log
 *
 * @param {string} contractAddress The address of the contract to refresh.
 * @param {number} maxSupply the max supply of the collection.
 * @param {number} startIndex the index to start refreshing from.
 * @param {number} threads how much processes will run in parallel.
 *
 * @author joyal-hg <https://github.com/joyal-hg>
 * @license MIT
 */
const fetch = require("node-fetch");
const basePath = process.cwd();
const { CONTRACT_ADDRESS, CHAIN } = require(`${basePath}/src/config.js`);
const maxSupply = 10000;
const startIndex = 1;
const threads = 1;
const chunkSize = maxSupply / threads;

const contractAddress = CONTRACT_ADDRESS || "";

const baseUrl =
  CHAIN.toLowerCase() === "rinkeby"
    ? `https://testnets-api.opensea.io/api/v1/asset`
    : "https://api.opensea.io/api/v1/asset";

const wait = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
};

const refresh = async (start, end) => {
  for (let tokenId = start; tokenId <= end; tokenId++) {
    if(contractAddress == ""){
        console.log("Invalid contract address");
        break;
    }
    try {
      await fetch(
        `${baseUrl}/${contractAddress}/${tokenId}/?force_update=true`
      ).then((res) => {
        console.log(tokenId + " res: "+ JSON.stringify(res));
        const status = res.status;
        if (status === 200) {
            console.log(`refreshed ${tokenId}`);
        } else {
          throw `ERROR STATUS: ${status}`;
        }
      }).catch((error) => {
        console.error(`CATCH ERROR: ${error}`);
      });
      await wait(1000); // we wait a bit to not be banned from the API
    } catch (err) {
      console.warn(`Unable to refresh cache: ${tokenId}`, err);
    }
  }
};

(async () => {
  // will create an array of promises to run in parallel of the length of the threads
  const promises = [];
  const startTime = Math.round(Date.now() / 1000);
  console.log("start timestamp is", startTime);
  for (let i = 0; i < threads; i++) {
    const start = startIndex + i * chunkSize;
    let end = startIndex + (i + 1) * chunkSize;
    if (end > maxSupply) {
      end = maxSupply;
    }
    promises.push(Promise.resolve().then(() => refresh(start, end)));
  }
  await Promise.all(promises);
  console.log("done");
  const endTime = Math.round(Date.now() / 1000);
  console.log("end timestamp is", endTime);
  console.log("total used time is", endTime - startTime);
  process.exit(0);
})();
