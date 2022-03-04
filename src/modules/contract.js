import Web3 from "web3/dist/web3.min.js";
import Messenger from "./messenger";

const { BN } = Web3.utils;

class Contract {
  constructor(TruffleContract, definition) {
    this.instance = TruffleContract;
    this.definition = definition;
    this.name = definition.contractName;
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
    methodsList.classList.add('block');

    let methods = Object.entries(this.instance.methods);
    methods.forEach(method => {
      // ===================================================
      // This is where we render each method's form.
      // ===================================================
      let methodName = method[0].split('(').shift();
      let methodDefinition = this.instance.abi.filter(a => { return a.name == methodName }).shift();
      let methodForm = this.renderMethodForm(methodDefinition);

      // Custom theming
      let titles = methodForm.querySelectorAll('h3');
      let labels = methodForm.querySelectorAll('label');
      let inputs = methodForm.querySelectorAll('input:not([type="submit"]');
      let submits = methodForm.querySelectorAll('input[type="submit"]');

      methodForm.classList.add('mt-2', 'p-6', 'bg-gray-200');
      titles.forEach(el => el.classList.add('font-bold'));
      labels.forEach(el => el.classList.add('block', 'w-full', 'cursor-pointer'));
      inputs.forEach(el => el.classList.add('block', 'w-full', 'border-2', 'p-1'));
      submits.forEach(el => el.classList.add('block', 'mt-2', 'mb-1', 'p-1', 'rounded-md', 'text-sm', 'text-center', 'border-2', 'cursor-pointer', 'bg-teal-400', 'hover:bg-teal-600'));

      methodsList.appendChild(methodForm);
    });

    // Custom elements for our frontend.
    let details = document.createElement('details');
    details.open = true;
    details.classList.add('p-4', 'border-2', 'bg-white');

    let summary = document.createElement('summary');
    summary.innerHTML = 'Methods';
    summary.title = 'Toggle method forms for "' + this.name + '.sol" contract';
    summary.classList.add('font-bold');

    details.appendChild(summary);
    details.appendChild(methodsList);
    // details.appendChild(eventsList);

    wrapper.appendChild(title);
    wrapper.appendChild(details);
    // wrapper.appendChild(buttons);

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
  }
}

export default Contract;
