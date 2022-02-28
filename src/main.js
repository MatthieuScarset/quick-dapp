import "@truffle/contract/dist/truffle-contract.min.js";
import Web3 from "web3/dist/web3.min.js";
import './main.css';
import Contract from './modules/contract';
import Messenger from './modules/messenger';
import Wallet from './modules/wallet';

// Import contract artifacts built by Truffle.
const contracts = import.meta.glob('../build/contracts/*.json');

// Connect to local Ganache chain.
const provider = new Web3.providers.HttpProvider("http://localhost:8545");

// Run application.
const main = async () => {
  // Enable clear button.
  document.querySelector('#messagesClear')
    .addEventListener('click', Messenger.clearAll, true);

  // Stop if no wallet provider found.
  if (!Boolean(window.ethereum)) {
    document.querySelector('#connect').classList.add('hidden');

    Messenger.error('<b>No wallet provider found</b>' +
      '<br>' +
      'You won\'t be able to do much with this app.' +
      '<br>' +
      'Please install and configure a wallet, such as:' +
      '<br>' +
      '<ul class="mt-2 list-disc list-inside">' +
      '<li><a href="https://frame.sh" target="_blank" class="link">Frame</a> (the best for privacy)</li>' +
      '<li><a href="https://metamask.io" target="_blank" class="link">Metamask</a> (the most popular)</li>' +
      '<li><a href="https://walletconnect.com" target="_blank" class="link">Wallet Connect</a> (the most ubiquous)</li>' +
      '</ul>'
    );

    return;
  }

  try {
    // "Login".
    const wallet = new Wallet();
    wallet.connectWallet();
    wallet.getNetwork();

    // Build contracts forms.
    window.contracts = [];
    for (let path in contracts) {
      contracts[path]()
        .then(async (definition) => {
          try {
            let instance = TruffleContract(definition);
            instance.setProvider(provider);
            await instance.deployed().then(instance => {
              instance.owner().then(owner => instance.deployedBy = owner);
              window.contracts[definition.contractName] = instance;
              let contract = new Contract(instance);
              console.log(contract);
              // @todo Render form.
              // @todo Render event || debug how to set a provider with a websocket.
            });
          } catch (e) { /* Fail silently. */ }
        });
    }

    Messenger.new('Contract(s) available in console with:<br><code>window.contracts</code>', 1);
  } catch (e) {
    console.error(e.message);
  }
}

main().then(() => document.querySelector('#loading').remove());
