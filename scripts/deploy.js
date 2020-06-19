const fs = require('fs-extra');
const path = require('path');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

const provider = new HDWalletProvider(
    'fame certain example face name silent talent fix diet mom zoo acoustic',
    'https://rinkeby.infura.io/v3/c178420e48dd441e80593e34dae0bd5d'
);


const web3 = new Web3(provider);

const compiledFiles = fs.readdirSync(path.resolve(__dirname, '../compiled'))
compiledFiles.forEach(compiledFile=>{
    const { interface, bytecode } = require(path.resolve(__dirname, '../compiled', compiledFile));

    (async () => {
      const accounts = await web3.eth.getAccounts();
      console.log('合约部署账户:', accounts[0]);

      console.time('合约部署耗时');

      const _amsAddress = "https://biaep.s3.ap-east-1.amazonaws.com/CdSe+QD+Synthesis+Continuous+Injection+_+with+data.bip";
      const _fileHash   = "e9b5a568cf772178edd84742c3a2787f39c9774fb0ccc960fbcb8da534b40164";
      const _ref        = "";

      const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [_amsAddress, _fileHash, _ref] })
        .send({ from: accounts[0], gas: '1000000' });

      console.timeEnd('合约部署耗时');

      const contractAddress = result.options.address;

      console.log('合约部署成功:', contractAddress);
      console.log('合约查看地址:', `https://rinkeby.etherscan.io/address/${contractAddress}`);

      const addressFile = path.resolve(__dirname, '../address.json');
      fs.writeFileSync(addressFile, JSON.stringify(contractAddress));
      console.log('地址写入成功:', addressFile);

      process.exit();
    })();
});