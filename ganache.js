require("dotenv").config();
const ganache = require("ganache");

const options = {
  account_keys_path: "ganache.json",
  // This is not working so we use the Deterministic option for now.
  // @see https://github.com/trufflesuite/ganache/issues/2571
  deterministic: true,
  wallet: {
    accounts: [process.env.PRIVATE_KEY, process.env.INITIAL_BALANCE],
  }
};
const server = ganache.server(options);
const port = process.env.PORT;
server.listen(port, err => {
  if (err) throw err;
  console.log(`ganache listening on port ${port}...`);
  const provider = server.provider;

  provider.request({
    method: "eth_accounts",
    params: []
  }).then(accounts => console.log(accounts));

});
