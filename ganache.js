require("dotenv").config();
const ganache = require("ganache");
const Web3 = require('web3');

const options = {
  account_keys_path: "ganache.json",
  wallet: {
    accounts: [
      {
        secretKey: `${process.env.PRIVATE_KEY}`,
        balance: Web3.utils.toHex(`${process.env.INITIAL_BALANCE}`)
      }
    ],
  }
};

const port = parseInt(process.env.PORT) || 8545;
const server = ganache.server(options);
server.listen(port, async err => {
  if (err) throw err;
  console.log(`ganache listening on port ${port}...`);
  const provider = server.provider;

  await provider.request({
    method: "eth_accounts",
    params: []
  }).then(accounts => console.log(accounts));

});
