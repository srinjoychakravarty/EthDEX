module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 9545,            // Standard Ethereum port (default: none)
      network_id: "*"        // Match any network id
    }
  },
  compilers: {
      solc: {
          version: "0.4.24"
      }
  }
};
