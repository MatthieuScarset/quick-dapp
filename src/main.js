import "@truffle/contract/dist/truffle-contract.min.js";
import Web3 from "web3/dist/web3.min.js";
import './main.css';
import Contract from './modules/contract';
import Messenger from './modules/messenger';
import Wallet from './modules/wallet';

// Import contract artifacts built by Truffle.
const contracts = import.meta.glob('../build/contracts/*.json');

// Connect to local Ganache chain.
const port = import.meta.env.PORT || 8545;
const provider = new Web3.providers.HttpProvider("http://localhost:" + port);
window.web3 = new Web3(provider);

const start = async () => {
  document.querySelector('#messagesClear')
    .addEventListener('click', Messenger.clearAll, true);

  // No fun because no wallet provider found.
  if (!Boolean(window.ethereum)) {
    document.querySelector('#walletConnect').classList.add('hidden');

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
  }

  try {
    // Login.
    const wallet = new Wallet();
    wallet.connectWallet();
    wallet.getNetwork();

    // Contracts.
    window.contracts = [];
    const contractsList = document.querySelector('#contracts');
    for (let path in contracts) {
      contracts[path]().then(async (definition) => {
        // Skip "Migrations" contract used by TruffleSuite.
        if (definition.contractName == 'Migrations') {
          return;
        }

        try {
          let instance = TruffleContract(definition);
          instance.setProvider(provider);
          instance.defaults({
            // Default sender is the current account.
            from: Boolean(window.ethereum) && window.ethereum.accounts ? window.ethereum.accounts[0] : null
          })
          // Deal with numbers easily.
          instance.numberFormat = 'BigNumber';
          await instance.deployed()
            .then(instance => {
              instance.owner().then(owner => instance.deployedBy = owner);
              window.contracts[definition.contractName] = instance;
              Messenger.new('Contract available in console with:<br>' +
                '<code>window.contracts[\'' + definition.contractName + '\']</code>');

              try {
                // ===================================================
                // Where we render forms for each contract's methods.
                // ===================================================
                let contract = new Contract(instance, definition);
                let contractForm = contract.renderContractForm();
                contractsList.appendChild(contractForm);
              } catch (e) { console.log(e.message) }
            })
        } catch (e) { console.log(e); }
      })
    }
  } catch (e) {
    console.error(e.message);
  }
}

// Yolo!
start().then(() => document.querySelector('#loading').remove());
