require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 8545,
      network_id: "*",
      host: "127.0.0.1"
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.WALLET_PRIVATE_KEY, process.env.RPC_SERVER, 0),
      network_id: 3,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "^0.8.3"
    }
  }
};
