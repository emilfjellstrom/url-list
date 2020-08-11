let listOfUrls = [];

// input box, as well as the span element into which we will place the error message.
const form = document.getElementsByTagName("form")[0];
const url = document.getElementById("url");
const urlList = document.getElementById("url-list");
const urlError = document.getElementById("url-error");
const paginationList = document.getElementById("pagination");
const removeButton = document.querySelector("#js-remove-item");

form.addEventListener("submit", (event) => {
  // if the url field is valid, we let the form submit
  if (!url.validity.valid) {
    // If it isn't, we display an appropriate error message
    showError();
  } else {
    const exists = listOfUrls.some((item) => item.url === url.value);

    if (!exists) {
      urlError.textContent = "";
      const urlItem = { id: Date.now(), url: url.value.trim() };
      listOfUrls.push(urlItem);
      updateList();
    } else {
      urlError.textContent = "Url already in list";
    }
  }
  // Then we prevent the form from being sent by canceling the event
  event.preventDefault();
});

const deleteItem = (id) => {
  const item = document.querySelector(`[data-key="${id}"]`);
  const updatedList = listOfUrls.filter((item) => item.id !== id);

  listOfUrls = updatedList;
  item.remove();
};

// Function to display corresponding error
const showError = () => {
  if (url.validity.valueMissing) {
    // If the field is empty
    // display the following error message.
    urlError.textContent = "You need to enter an e-mail address.";
  } else if (url.validity.typeMismatch) {
    // If the field doesn't contain an url address
    // display the following error message.
    urlError.textContent = "i.e. http://example.com, https://example.com";
  }
};

const updateList = () => {
  updatePagination();
  const numberOfPages = Math.ceil(listOfUrls.length / 20);
  paginate(numberOfPages);
};

const paginate = (page_number) => {
  return renderPagination(
    listOfUrls.slice((page_number - 1) * 20, page_number * 20)
  );
};

const updatePagination = () => {
  const numberOfPages = Math.ceil(listOfUrls.length / 20);
  while (paginationList.firstChild)
    paginationList.removeChild(paginationList.firstChild);

  for (let i = 0; i < numberOfPages; i++) {
    const node = document.createElement("li");
    const button = document.createElement("button");
    button.innerHTML = i + 1;
    button.onclick = () => paginate(i + 1);

    paginationList.append(node.appendChild(button));
  }
};

const renderPagination = (list) => {
  while (urlList.firstChild) urlList.removeChild(urlList.firstChild);

  for (const urlItem of list) {
    const node = document.createElement("li");
    node.setAttribute("data-key", urlItem.id);

    const a = document.createElement("a");
    a.setAttribute("href", urlItem.url);
    a.innerHTML = urlItem.url;

    const button = document.createElement("button");
    button.innerHTML = "x";
    button.onclick = () => deleteItem(urlItem.id);

    // Set the contents of the `li` element created above
    node.append(a, button);
    urlList.append(node);
  }
};
