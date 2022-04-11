const basePath = process.cwd();
const fs = require("fs");
const buildDir = `${basePath}/build`;
const backupDir = `${buildDir}/backupJson`;
const readDir = `${buildDir}/json`;

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

console.log("Starting backup metadata.");

fs.readdirSync(readDir).forEach(file => {
  if(!regex.test(file)) {
    return;
  }
  const fileData = fs.createReadStream(`${readDir}/${file}`);
  fs.writeFileSync(
    `${backupDir}/${file}`,
    JSON.stringify(fileData, null, 2)
  );
  console.log(`${file} backed up!`);
});
