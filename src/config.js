const basePath = process.cwd();
const fs = require("fs");
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// Metadata for Ethereum
const namePrefix = "RarePupils";
const description = "Pupil is the eye of the heart and some pupil are unique and rare";
const baseUri = "ipfs://ReplaceThisURL"; // This will be replaced automatically

// IPFS Info
const AUTH = '9528a0f7-87dd-42d6-a231-195b5e7d3aa8'; // API AUTH for nft port upload, not used now
const CHAIN = 'rinkeby';
const CONTRACT_ADDRESS = '0xF655bDdc632c8dd697335FD7eFd6374521314bdc';
const GENERIC_TITLE = "Rare Pupil"; // Replace with what you want the generic titles to say.
const GENERIC_DESCRIPTION = "Pupil is the eye of the heart and some pupil are unique and rare"; // Replace with what you want the generic descriptions to say.
const GENERIC_IMAGE = "https://gateway.pinata.cloud/ipfs/QmWDGN22z3WDbk43tmtYF6mvaxEFBxUHYTdgUeqmuQkGMR"; // Replace with your generic image(s). If multiple, separate with a comma.
// END IPFS Info

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
  {
    growEditionSizeTo: 10000,
    layersOrder: [
      { name: "Background" },
      { name: "Body" },
      { name: "Special" },
      { name: "Eyes" },
      { name: "Head" },
      { name: "Nose" },
      { name: "Mouth" },
      { name: "Dress" },
      { name: "Horn" },
      { name: "Pupils" },
      { name: "Accessories" },
    ],
  },
];

const shuffleLayerConfigurations = false;

const debugLogs = false;

const format = {
  width: 2048,
  height: 2048,
  smoothing: false,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 2 / 128,
};

const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 20,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  pixelFormat,
  text,
  namePrefix,
  network,
  gif,
  preview_gif,
  AUTH,
  CONTRACT_ADDRESS,
  CHAIN,
  GENERIC_TITLE,
  GENERIC_DESCRIPTION,
  GENERIC_IMAGE,
};
