const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

// 1. cleanup
const compiledDir = path.resolve(__dirname, '../compiled');
fs.removeSync(compiledDir);
fs.ensureDirSync(compiledDir);

// 2. search all contracts
const contractFiles = fs.readdirSync(path.resolve(__dirname, '../contracts'));
console.log(contractFiles);
contractFiles.forEach(contractFile => {
    // 2.1 compile
    console.log("");
    console.log(contractFile);
    const contractPath = path.resolve(__dirname, '../contracts', contractFile);
    const contractSource = fs.readFileSync(contractPath, 'utf8');
    console.log(contractPath);
    const result = solc.compile(contractSource);
    console.log(`file compiled: ${contractFile}`)

    // 2.2 check errors
    if (Array.isArray(result.errors) && result.errors.length) {
        throw new Error(result.errors[0]);
    }

    // 2.3 save to disk
    console.log(Object.keys(result.contracts));
    const name = Object.keys(result.contracts)[0].replace(/^:/, '');
    const filePath = path.resolve(compiledDir, `${name}.json`);
    fs.outputJsonSync(filePath, result.contracts[Object.keys(result.contracts)[0]]);
});