const DEXExchange = artifacts.require('./DEXExchange.sol');

const should = require('chai')
 .use(require('chai-as-promised'))
 .should();

let sender;

contract('token_management', function(accounts) {

  beforeEach(async () => {
  	  sender = await DEXExchange.new();
      satva = web3.utils.asciiToHex('SATVA');
      arbitary_addr = web3.utils.toChecksumAddress('0x69c4bb240cf05d51eeab6985bab35527d04a8c64');
  	  await sender.addNewToken(satva, arbitary_addr);
  	});

  it("a new supported token can be successfully added at a given address", async() => {
    let address = await sender.tokens.call(satva);
    address.should.equal(arbitary_addr);
  });
});
