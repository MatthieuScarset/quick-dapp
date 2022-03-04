
let buttons = document.createElement('nav');
buttons.classList.add('flex', 'items-center', 'space-between', 'text-sm', 'cursor-pointer', 'bg-gray-200');

// Copy contract address.
let btnAbi = document.createElement('button');
btnAbi.id = this.name + '-copyAbi';
btnAbi.innerHTML = 'Copy ABI';
btnAbi.classList.add('flex-1', 'p-6', 'button');
btnAbi.addEventListener('click', () => {
  navigator.clipboard.writeText(JSON.stringify(this.instance.abi));
  Messenger.new('Contract\'s ABI copied!', true);
});
buttons.append(btnAbi);

// Copy ABI.
let btnAddress = document.createElement('button');
btnAddress.id = this.name + '-copyAddress';
btnAddress.innerHTML = 'Copy address';
btnAddress.classList.add('flex-1', 'p-6', 'button');
btnAddress.addEventListener('click', () => {
  navigator.clipboard.writeText(this.instance.address);
  Messenger.new('Address copied!', true);
});
buttons.append(btnAddress);

// Open artifact.
let btnOpen = document.createElement('button');
btnOpen.id = this.name + '-openJson';
btnOpen.innerHTML = 'Full details';
btnOpen.classList.add('flex-1', 'p-6', 'button');
btnOpen.addEventListener('click', () => window.open('/contracts/' + this.name + '.json'), true);
buttons.append(btnOpen);
