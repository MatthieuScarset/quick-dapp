require('dotenv').config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: process.env.PORT,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.10",
    }
  },
};
