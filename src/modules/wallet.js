import Web3 from "web3/dist/web3.min.js";
import Messenger from "./messenger";

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

class Wallet {
  constructor() {
    this.account = false;
    this.element = document.querySelector('#wallet');

    this.btn = document.querySelector('#walletConnect');
    this.btn.addEventListener('click', this.connect, true);

    this.address = document.querySelector('#walletAddress');
    this.address.addEventListener('click', this.copy);

    this.balance = document.querySelector('#walletBalance');

    // Register events.
    window.ethereum.on('accountsChanged', this.accountsChanged, true);
    window.ethereum.on('chainChanged', this.networkChanged, true);
  }

  static getNetwork = async () => {
    let network = {};
    network.id = await web3.eth.net.getId().then(id => id);
    network.name = await web3.eth.net.getNetworkType().then(name => name);
    return network;
  }

  copy = () => {
    let address = this.address.innerHTML;
    if (address && address.length) {
      navigator.clipboard.writeText(address);
      Messenger.new('Address copied!', true);
    }
  }

  connect = async () => {
    Messenger.clearAll();

    this.btn.disabled = true;
    let text = this.btn.innerHTML;
    this.btn.innerHTML = 'Loading...';

    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        let account = accounts[0];

        if (!account) {
          this.btn.classList.remove('hidden');
          this.address.classList.add('hidden');
          this.address.innerHTML = '';
        }

        if (account) {
          this.btn.classList.add('hidden');
          this.address.classList.remove('hidden');
          this.address.innerHTML = account;
          Messenger.new('Connected as:<br>' + account, true);
        }

        this.account = account;
      })
      .catch(e => {
        switch (e.code) {
          case undefined:
          case 4001:  // Wallet closed.
          case -32002: // Another request exists.
            Messenger.error('¯\\_(ツ)_/¯ ' + e.message + '<br>' +
              'Make sure your wallet is open and try again');
            break;
          default:
            Messenger.error('<b>' + e.code + '</b> ' + e.message);
            console.log(e.code, e.message);
            break;
        }
      })
      .finally(() => {
        this.btn.disabled = false;
        this.btn.innerHTML = text;

        // Refresh balance.
        this.getBalance();
      });
  }

  getBalance = async () => {
    if (!this.account) {
      return;
    }

    await web3.eth.getBalance(this.account)
      .then(balance => {
        let balanceEth = web3.utils.fromWei(balance, 'ether');
        this.balance.innerHTML = Intl.NumberFormat().format(balanceEth);
        this.balance.classList.add('is-ether');
      });
  }

  accountsChanged = async (accounts) => {
    Messenger.new('Account changed: ' + accounts[0]);
    Messenger.new('Reloading window to reflect changes...');
    setTimeout(() => { window.location.reload() }, 2500);
  }

  networkChanged = async (chainId) => {
    Messenger.new('Blockchain switched to: ' + chainId);
    Messenger.new('Reloading window to reflect changes...');
    setTimeout(() => { window.location.reload() }, 5000);
  }
}

export default Wallet;
