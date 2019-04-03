const DEXExchange = artifacts.require('./DEXExchange.sol');
const IndicaGeneSeed = artifacts.require('./IndicaGeneSeed.sol');
const SativaGeneSeed = artifacts.require('./SativaGeneSeed.sol');
const BigNumber = web3.BigNumber;

const should = require('chai')
 .use(require('chai-as-promised'))
 .use(require('chai-bignumber')(BigNumber))
 .should();

let sender, indica, sativa;

contract('token_transfer', function(accounts) {

  let account1, account2;

   [account1, account2] = accounts;

   beforeEach(async () => {
    sender = await DEXExchange.new();
    indica = await IndicaGeneSeed.new();
    symbol_indca = web3.utils.asciiToHex('INDCA');
    price = 3
    await sender.addNewToken(symbol_indca, indica.address, price);
   });


   it("DEXExchange is able to transfer tokens to another wallet", async() => {
     // When transfering  token, multiply by
     //10 ^ of decimal to get exact token e.g
     //to send 6 INDCA = 6e5, where 5 is the decimal places in INDCA
     const BN = web3.utils.BN;
     let amount = new BN(600000e5);
     //Account1 approves contract to spend 3 INDCA on its behalf
     await indica.approve(sender.address, amount,{from: account1});
     await sender.transferTokens(symbol_indca,account2, (amount/6),{from: account1});
     let balance = ((await indica.balanceOf(account2)).toString());
     balance.should.equal((amount/6).toString())
   });
});
