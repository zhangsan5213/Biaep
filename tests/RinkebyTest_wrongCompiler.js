const path    = require('path');
const assert  = require('assert');
const Web3    = require('web3');

const HDWalletProvider = require('truffle-hdwallet-provider');
const provider = new HDWalletProvider(
    'fame certain example face name silent talent fix diet mom zoo acoustic',
    'https://rinkeby.infura.io/v3/c178420e48dd441e80593e34dae0bd5d'
);
const web3 = new Web3(provider);

const contractPath = path.resolve(__dirname, '../compiled/Biaep.json');
const { interface, bytecode } = require(contractPath);

describe('Biaep Contract', () => {

    let accounts;
    let contract;
    let _amsAddress;
    let _fileHash;
    let _ref;

    beforeEach( async (done) => {

        accounts = await web3.eth.getAccounts();
        console.log('合约部署账户:', accounts[0]);

        console.time('合约部署耗时');

        _amsAddress = "https://www.google.com/";
        _fileHash   = web3.utils.soliditySha3({
          t: 'bytes32',
          v: "content of the BIP file" });
        _ref        = "0x248c40A37Dc95Bd1D0A31951a0209b9896a12C6A";

        contract = await new web3.eth.Contract(JSON.parse(interface))
          .deploy({ data: bytecode, arguments: [_amsAddress, _fileHash, _ref] })
          .send({ from: accounts[0], gas: '1000000' });
        console.timeEnd('合约部署耗时');

        console.log('合约部署成功:', contract.options.address);

        done();

    });

    it('Deploy a contract', async (done) => {
        assert.ok(contract.options.address);
        done();
    }).timeout(50000);

    it('Parameters uploaded', async () => {
        const _address   = await contract.methods.amsAddress().call();
        const _hash      = await contract.methods.fileHash().call();
        const _reference = await contract.methods.ref().call();

        assert.equal(_address,   _amsAddress);
        assert.equal(_hash,      _fileHash);
        assert.equal(_reference, _ref);
    });

    it('Vote', async () => {
        const posvote = 1; // A supporting vote
        const negvote =-1; // A opposing vote
        const price = 0.001; // In ether, the price required.

        const nvote    = await contract.methods.numberofVotes().call();
        const _posvote = await contract.methods.positiveVotes().call();
        const _negvote = await contract.methods.negativeVotes().call();
        console.log("----- Default value for votes -----")
        console.log("The number of all votes is now: ", nvote);
        console.log("The number of positive votes is now: ", _posvote);
        console.log("The number of negative votes is now: ", _negvote);

        await contract.methods.vote(posvote).send({  
            from: accounts[1],
            value: web3.utils.toWei(price.toString(), "ether")
        });
        await contract.methods.vote(posvote).send({  
            from: accounts[2],
            value: web3.utils.toWei(price.toString(), "ether")
        });
        await contract.methods.vote(negvote).send({  
            from: accounts[3],
            value: web3.utils.toWei(price.toString(), "ether")
        });
        const nvote_after    = await contract.methods.numberofVotes().call();
        const _posvote_after = await contract.methods.positiveVotes().call();
        const _negvote_after = await contract.methods.negativeVotes().call();
        console.log("----- Value for votes after voting -----")
        console.log("The number of all votes is now: ", nvote_after);
        console.log("The number of positive votes is now: ", _posvote_after);
        console.log("The number of negative votes is now: ", _negvote_after);

        const v1 = await contract.methods.votes(accounts[1]).call();
        const v2 = await contract.methods.votes(accounts[2]).call();
        const v3 = await contract.methods.votes(accounts[3]).call();
        console.log("----- Votes from different accounts -----")
        console.log("The vote from account 1 is: ", v1);
        console.log("The vote from account 2 is: ", v2);
        console.log("The vote from account 3 is: ", v3);

        assert.equal(parseInt(nvote) + 3, nvote_after)
        assert.equal(parseInt(_posvote) + 2, _posvote_after);
        assert.equal(parseInt(_negvote) + 1, _negvote_after);
    })

});