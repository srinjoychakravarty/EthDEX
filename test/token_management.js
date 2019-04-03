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
    const object = await sender.tokens.call(satva);
    let address = object.tokenContract;
    address.should.equal('0xde2Aec800eBecEfF16cEac9EEE2789D56Ea95B76');
  });

  it("a newly added token has the right exhange rate", async() => {
    const object = await sender.tokens.call(satva);
    // toNumber converts the returned big number datatype to integer for proper comparison
    let address = object.exchangeRate.toNumber();
    address.should.equal(2);
  });

  it("an existing token can be completly purged from DEXExchange", async() => {
  await sender.removeToken(satva);
  const object = await sender.tokens.call(satva);
  let address = object.tokenContract;
  address.should.equal('0x0000000000000000000000000000000000000000');
});
});
