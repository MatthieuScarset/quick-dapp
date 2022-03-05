import Web3 from "web3/dist/web3.min.js";
import Messenger from "./messenger";

const { BN } = Web3.utils;

class Contract {
  constructor(TruffleContract, definition) {
    this.definition = definition;
    this.name = definition.contractName;
    this.abi = definition.abi || [];
    this.address = definition.address;

    // TruffleContract instance.
    this.instance = TruffleContract;

    // Web3 JS instance.
    this.web3 = new window.web3.eth.Contract(this.abi, this.address);
  }

  renderContractForm = () => {
    // Custom elements for our frontend.
    let wrapper = document.createElement('div');
    wrapper.id = 'contract-' + this.name;
    wrapper.classList.add('mt-4', 'p-4', 'border-2', 'bg-gray-200');

    // Title
    let title = document.createElement('h2');
    title.innerHTML = this.name;
    title.classList.add('mb-2', 'text-2xl', 'font-bold');

    let methodsList = document.createElement('div');
    methodsList.classList.add('flex', 'space-between', 'flex-wrap', 'items-stretch');

    let methods = Object.entries(this.instance.methods);
    methods.forEach(method => {
      // ===================================================
      // This is where we render each method's form.
      // ===================================================
      let methodName = method[0].split('(').shift();
      let methodDefinition = this.instance.abi.filter(a => { return a.name == methodName }).shift();
      let methodForm = this.renderMethodForm(methodDefinition);

      let buttons = {
        'call': 'call',
        'send': 'sendTransaction',
        'gas': 'estimateGas',
        'encode': 'encodeABI'
      };
      if (methodDefinition.stateMutability === 'view') {
        delete buttons.send;
      }

      let actions = document.createElement('div');
      actions.classList.add('flex', 'items-center', 'space-between');
      Object.entries(buttons).forEach(pair => {
        let submit = document.createElement('input');
        submit.type = 'submit';
        submit.value = pair[0];
        submit.id = this.name + '-' + name;
        submit.dataset.action = pair[1];
        submit.classList.add('basis-1/4', 'max-w-1/4');

        actions.appendChild(submit);
      });
      methodForm.appendChild(actions);

      methodForm.addEventListener('submit', this.onMethodFormSubmit);

      // Custom theming
      let titles = methodForm.querySelectorAll('h3');
      let labels = methodForm.querySelectorAll('label');
      let inputs = methodForm.querySelectorAll('input:not([type="submit"]');
      let submits = methodForm.querySelectorAll('input[type="submit"]');

      let inner = document.createElement('div');
      inner.classList.add('flex-1', 'basis-2/4', 'w-1/2', 'max-w-1/2');
      inner.style.maxWidth = '50%';
      inner.appendChild(methodForm);

      methodForm.classList.add('m-2', 'p-4', 'border-2', 'bg-gray-100');
      titles.forEach(el => el.classList.add('font-bold'));
      labels.forEach(el => el.classList.add('block', 'w-full', 'cursor-pointer'));
      inputs.forEach(el => el.classList.add('block', 'w-full', 'border-2', 'p-1'));
      submits.forEach(el => el.classList.add('block', 'ny-2', 'button--submit'));

      methodsList.appendChild(inner);
    });

    // Custom elements for our frontend.
    let details = document.createElement('details');
    details.open = true;
    details.classList.add('p-4', 'border-2', 'bg-white');

    let summary = document.createElement('summary');
    summary.innerHTML = 'Methods';
    summary.title = 'Toggle method forms for "' + this.name + '.sol" contract';
    summary.classList.add('font-bold');

    let buttons = document.createElement('nav');
    buttons.classList.add('flex', 'items-center', 'space-between', 'mt-2', 'mb-2', 'text-sm', 'cursor-pointer', 'bg-gray-200');

    // Copy ABI.
    let btnAddress = document.createElement('button');
    btnAddress.id = this.name + '-copyAddress';
    btnAddress.innerHTML = 'Copy address';
    btnAddress.classList.add('button--copy');
    btnAddress.addEventListener('click', () => {
      navigator.clipboard.writeText(this.instance.address);
      Messenger.new('Address copied in your clipboard!', true);
    });
    buttons.append(btnAddress);

    // Copy contract address.
    let btnAbi = document.createElement('button');
    btnAbi.id = this.name + '-copyAbi';
    btnAbi.innerHTML = 'Copy ABI';
    btnAbi.classList.add('button--copy', 'mx-2');
    btnAbi.addEventListener('click', () => {
      navigator.clipboard.writeText(JSON.stringify(this.instance.abi));
      Messenger.new('Contract\'s ABI copied!', true);
    });
    buttons.append(btnAbi);

    // Open artifact.
    let btnOpen = document.createElement('button');
    btnOpen.id = this.name + '-copyDefinition';
    btnOpen.innerHTML = 'Copy full artifact';
    btnOpen.classList.add('button--copy');
    btnOpen.addEventListener('click', () => {
      navigator.clipboard.writeText(JSON.stringify(this.definition));
      Messenger.new('Artifact copied in your clipboard!', true);
    }, true);
    buttons.append(btnOpen);

    details.appendChild(summary);
    details.appendChild(methodsList);
    // details.appendChild(eventsList);

    wrapper.appendChild(title);
    wrapper.appendChild(buttons);
    wrapper.appendChild(details);

    return wrapper;
  }

  renderMethodForm = (methodDefinition) => {
    let name = methodDefinition.name || 'unknown method';
    let inputs = methodDefinition.inputs || [];

    let form = document.createElement('form');
    form.title = name + ' form';
    form.id = 'contract-' + this.instance.name + '-form-' + name;
    form.tabIndex = 0;
    // Save method name for later use in submit.
    form.dataset.methodName = name;

    let title = document.createElement('h3');
    title.innerHTML = name;
    title.tabIndex = 0;
    form.appendChild(title);

    inputs.forEach(input => {
      let uniqueId = this.name + '-method-' + name + '-input-' + input.name;
      let label = document.createElement('label');
      label.htmlFor = uniqueId;
      label.innerHTML = input.name;
      label.tabIndex = 0;
      form.appendChild(label);

      let element = document.createElement('input');
      element.id = uniqueId;
      element.name = input.name;
      element.placeholder = input.type;
      form.appendChild(element);
    });

    return form;
  }

  onMethodFormSubmit = async (event) => {
    event.preventDefault();

    Messenger.clearAll();

    let methodForm = event.target;
    let methodName = methodForm.dataset.methodName;
    let formData = new FormData(methodForm);

    let args = {};
    let params = [];
    // Get call parameters.
    for (var pair of formData.entries()) {
      args[pair[0]] = pair[1];
      params.push(pair[1]);
    }

    // Get custom transaction options, if set.
    let txParamsForm = document.getElementById('tx-options-form');
    let txParamsData = new FormData(txParamsForm);
    let options = {}
    for (var pair of txParamsData.entries()) {
      let value = pair[1];
      if (value.length < 1) { continue; }
      if (parseInt(pair[1])) {
        value = new BN(pair[1]).toString();
      }
      options[pair[0]] = value;
    };

    // Display call details.
    let msg = 'Call <em><b>' + this.name + '.' + methodName + '()<em></b><br>' +
      'Arguments: <code>' + JSON.stringify(params) + '</code>' +
      'Options: <code>' + JSON.stringify(options) + '</code>';
    Messenger.new(msg);

    // Prepare call action (default: `call`).
    let action = event.submitter.dataset.action ?? 'call';

    let fn;
    if (action == 'encodeABI') {
      // Use Web3 instance for specific methods.
      fn = this.web3.methods[methodName];
    } else {
      // Use TruffleInstance by default.
      fn = this.instance[methodName][action];
    }

    let promise;
    // Handle methods with/without arguments.
    if (Boolean(params.length) && Boolean(options.length)) {
      promise = fn(...params, options);
    } else if (Boolean(params.length)) {
      promise = fn(...params);
    } else if (Boolean(options.length)) {
      promise = fn(options);
    } else {
      promise = fn();
    }


    switch (action) {
      case 'encodeABI':
        Messenger.new('Signature hash:<br><code>' + promise.encodeABI() + '</code>', 0, 2);
        break;
      case 'estimateGas':
        await promise
          .then(gasAmount => Messenger.new('Gas amount estimated:<br>' + gasAmount, 0, 2))
          .catch(error => Messenger.error('Error ' + error.code + ': ' + error.message, 0));
        break;
      case 'call':
        await promise
          .then(result => {
            let message = typeof (result) == 'object' ? JSON.stringify(result) : result;
            Messenger.new('<b>Result</b><br>' + message, 0, 2)
          })
          .catch(error => Messenger.error('Error ' + error.code + ': ' + error.message, 0));
        break;
      case 'sendTransaction':
        await promise
          .on('transactionHash', hash => Messenger.new('TX hash:<code>' + hash + '</code>', 0, 2))
          .on('receipt', receipt => Messenger.new('TX receipt:<code>' + JSON.stringify(receipt) + '</code>', 0, 2))
          .on('confirmation', (confirmationNumber, receipt) => Messenger.new('TX confirmation:<b>' + confirmationNumber + '</b><code>' + JSON.stringify(receipt) + '</code>', 0, 2))
          .on('error', (error, receipt) => Messenger.error('Error ' + error.code + ': ' + error.message + '<code>' + JSON.stringify(receipt) + '</code>', 0));
        break;
      default:
        console.log('Unknown action: ' + action);
        Messenger.error('<p class="font-bold">Unknown action: ' + action + '</p>');
        break;
    }
  }
}

export default Contract;
