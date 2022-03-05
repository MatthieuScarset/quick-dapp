# Quick dApp

Quickly create and test your Dapp, locally.

Clone this repo and run:

```bash
yarn start
```

We could not make this quicker ¯\_(ツ)_/¯ sorry! :)


## Account

We run the Ganache blockchain in a deterministic manner, **using a hardcoded private key** in `package.json`.

You will need to import this account in your wallet provider in order to _send_ transactions to your contracts.

Simply copy/paste the private key from `./ganache.json` into your wallet provider.

Finally, select the localhost network at port 8545 in your wallet.

Please, **do not use this on production**.



## Smart contracts

Once your _local_ is started, you can work on the _backend_:

- Create on your contracts as usual in the `/contracts` folder
- Run `yarn test` (or `truffle test`) to test your smart contracts
- Run `yarn migrate` (or `truffle migrate --reset`) to deploy to the running Ganache chain

Once migrated, the frontend should update automatically.

There will be a form to play with your contracts' methods.

Restart the app `yarn stop && yarn start` and re-open your browser at `http://localhost:3000`.

That's it, let's BUIDL things now!

## Dependencies

- [Truffle](https://trufflesuite.com/) and [Truffle Contract](https://github.com/trufflesuite/truffle/tree/develop/packages/contract) in particular
- [Ganache](https://github.com/trufflesuite/ganache) to start a blockchain locally, with a deterministic account
- [Vite (VanillaJS)](https://vitejs.dev/) to start
- [TailwindCSS](https://v2.tailwindcss.com/)
