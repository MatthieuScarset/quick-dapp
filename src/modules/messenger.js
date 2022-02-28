class Messenger {
  static timeout = 3000;

  static icon = '<span class="sr-only">Close menu</span>' +
    '<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />' +
    "</svg>";

  static error(msg, autoRemove = false) {
    this.new(msg, autoRemove, -1);
  }

  static new(msg, autoRemove = false, type = 0) {
    let wrapper = document.querySelector('#messages');

    let item = document.createElement('section');
    item.id = "message-" + (wrapper.childElementCount + 1);
    item.tabIndex = 0;
    item.classList.add("message", "relative", "mt-3", "p-3");
    item.classList.add("rounded", "shadow", "border", "border-gray-400");
    item.classList.add(type == -1 ? 'bg-red-400' : (type > 1 ? "bg-teal-400" : "bg-white"));
    item.classList.add(type == -1 ? "text-white" : "text-black");

    let closeButton = document.createElement('button');
    closeButton.innerHTML = this.icon;
    closeButton.classList.add("absolute", "-top-3", "-right-3", "inline-flex", "items-center", "justify-center");
    closeButton.classList.add("bg-white", "rounded-md", "text-gray-400");
    closeButton.classList.add("hover:opacity-50", "hover:text-gray-500", "hover:bg-gray-100");
    closeButton.classList.add("focus:outline-none", "focus:ring-2", "focus:ring-inset", "focus:ring-indigo-50")
    closeButton.addEventListener("click", (event) => { event.target.closest('.message').remove(); }, true);

    let content = document.createElement('div');
    content.innerHTML = msg;

    item.appendChild(closeButton);
    item.appendChild(content);

    if (autoRemove) {
      setTimeout(() => item.remove(), this.timeout);
    }

    wrapper.appendChild(item);
  }

  static clearAll = () => {
    document.querySelectorAll('.message').forEach((el) => { el.remove() });
  }

}

export default Messenger;
