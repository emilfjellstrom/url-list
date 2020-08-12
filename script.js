let listOfUrls = [];
let activePage = 1;
// input box, as well as the span element into which we will place the error message.
const form = document.getElementsByTagName("form")[0];
const url = document.getElementById("url");
const urlList = document.getElementById("url-list");
const urlError = document.getElementById("url-error");
const backPagination = document.getElementById("back-pagination");
const forwardPagination = document.getElementById("forward-pagination");
const paginationList = document.getElementById("pagination");
const removeButton = document.querySelector("#js-remove-item");

window.addEventListener("load", function () {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("links"))
    .split("=")[1];

  listOfUrls = JSON.parse(cookieValue);

  updatePagination();
  paginate(1);
});

url.addEventListener("input", (event) => {
  event.target.value.length > 0
    ? url.classList.add("active")
    : url.classList.remove("active");
});

form.addEventListener("submit", (event) => {
  // if the url field is valid, we let the form submit
  if (!url.validity.valid) {
    // If it isn't, we display an appropriate error message
    showError();
  } else {
    urlError.classList.remove("active");
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
  document.cookie = `links=${JSON.stringify(
    listOfUrls
  )};expires="Thu Nov 26 2021 15:44:38"`;
  // Then we prevent the form from being sent by canceling the event
  event.preventDefault();
});

const deleteItem = (id) => {
  const item = document.querySelector(`[data-key="${id}"]`);
  const updatedList = listOfUrls.filter((item) => item.id !== id);

  listOfUrls = updatedList;
  item.remove();

  if (urlList.childElementCount === 0) {
    updatePagination();
    paginate(activePage - 1);
  }
};
// Function to display corresponding error
const showError = () => {
  if (url.validity.valueMissing) {
    // If the field is empty
    // display the following error message.
    urlError.classList.add("active");
    urlError.textContent = "You need to enter an e-mail address.";
  } else if (url.validity.typeMismatch) {
    // If the field doesn't contain an url address
    // display the following error message.
    urlError.classList.add("active");
    urlError.textContent = "i.e. http://example.com, https://example.com";
  }
};

const updateList = () => {
  updatePagination();
  const numberOfPages = Math.ceil(listOfUrls.length / 5);
  paginate(numberOfPages);
};

const paginate = (page_number) => {
  activePage = page_number;

  if (page_number === 1) {
    backPagination.disabled = true;
  } else {
    backPagination.disabled = false;
    backPagination.onclick = () => paginate(page_number - 1);
  }
  if (page_number === Math.ceil(listOfUrls.length / 5)) {
    forwardPagination.disabled = true;
  } else {
    forwardPagination.disabled = false;
    forwardPagination.onclick = () => paginate(page_number + 1);
  }

  const allButtons = document.querySelectorAll(`[data-button]`);
  allButtons.forEach((item) => item.classList.remove("active"));

  const activeButton = document.querySelector(`[data-button="${page_number}"]`);
  activeButton.classList.add("active");

  return renderPagination(
    listOfUrls.slice((page_number - 1) * 5, page_number * 5)
  );
};

const updatePagination = () => {
  const numberOfPages = Math.ceil(listOfUrls.length / 5);
  while (paginationList.firstChild)
    paginationList.removeChild(paginationList.firstChild);

  for (let i = 0; i < numberOfPages; i++) {
    const node = document.createElement("li");
    const button = document.createElement("button");
    ("");
    button.setAttribute("data-button", i + 1);
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

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "x";
    deleteBtn.onclick = () => deleteItem(urlItem.id);

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "edit";
    editBtn.onclick = () => updateUrl(urlItem.id);
    const div = document.createElement("div");

    // Set the contents of the `li` element created above
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    node.append(a, div);
    urlList.append(node);
  }
};

const updateUrl = (id) => {
  const urlReg = /^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
  const item = document.querySelector(`[data-key="${id}"]`);

  let url = prompt("Enter a new valid url");

  if (url === null) return;

  if (urlReg.test(url)) {
    const elementsIndex = listOfUrls.findIndex((urlItem) => urlItem.id == id);
    let copyOfUrls = [...listOfUrls];
    copyOfUrls[elementsIndex] = { ...copyOfUrls[elementsIndex], url: url };
    listOfUrls = copyOfUrls;

    item.children[0].href = url;
    item.children[0].innerHTML = url;
  } else {
    alert("Invalid format");
  }
};
