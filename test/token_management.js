const DEXExchange = artifacts.require('./DEXExchange.sol');

const should = require('chai')
 .use(require('chai-as-promised'))
 .should();

let sender;

contract('token_management', function(accounts) {

  beforeEach(async () => {
  	  sender = await DEXExchange.new();
      satva = web3.utils.asciiToHex('SATVA');
      // Hex Address is converted to mixed case so that test passes
      arbitary_addr = web3.utils.toChecksumAddress('0xde2Aec800eBecEfF16cEac9EEE2789D56Ea95B76');
      price = 2;
  	  await sender.addNewToken(satva, arbitary_addr, price);
  	});

  it("a new supported token can be successfully added at a given address", async() => {
    let address = await sender.tokens.call(satva);
    address.should.equal(arbitary_addr);
  });

  updated_addr = web3.utils.toChecksumAddress('0x3fF68A19B5F892BB9e53eA67EF2E228b183A400A');
  it("an existing token can have its address updated", async() => {
  await sender.addNewToken(satva, updated_addr);
  let address = await sender.tokens.call(satva);
  address.should.equal(updated_addr);
  });

  it("existing token can be completly purged from DEXExchange", async() => {
  await sender.removeToken(satva);
  let address = await sender.tokens.call(satva);
  address.should.equal('0x0000000000000000000000000000000000000000');
});
});
