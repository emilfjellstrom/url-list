let listOfUrls = [];
let activePage = 1;

const form = document.getElementsByTagName('form')[0];
const url = document.getElementById('url');
const urlList = document.getElementById('url-list');
const urlError = document.getElementById('url-error');
const backPagination = document.getElementById('back-pagination');
const forwardPagination = document.getElementById('forward-pagination');
const paginationList = document.getElementById('pagination');
const urlListContainer = document.getElementById('url-list-container');
const removeButton = document.querySelector('#js-remove-item');

window.addEventListener('load', function () {
  // Reset form to remove persistant value in input
  form.reset();
  // Check if cookie exist with value links
  if (document.cookie.split('; ').find((row) => row.startsWith('links'))) {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('links'))
      .split('=')[1];
    // If links exist in cookie, save them in list array and create submit button
    listOfUrls = JSON.parse(cookieValue);
    listOfUrls.length > 0 && createSubmitButton();
  }
  // Set pagination
  updatePagination();
  // Render first page
  paginate(1);
});

// Add css to keep label extended after blur
url.addEventListener('input', (event) => {
  event.target.value.length > 0
    ? url.classList.add('active')
    : url.classList.remove('active');
});

form.addEventListener('submit', (event) => {
  // If the url field is valid, let the form submit
  if (!url.validity.valid) {
    // If it is not valid, display an appropriate error message
    showError();
  } else {
    // Remove error message if value is valid
    urlError.classList.remove('active');
    // Check if url already exist
    const exists = listOfUrls.some((item) => item.url === url.value);

    if (!exists) {
      urlError.textContent = '';
      // Trim unwanted space and store url with uniqe id
      const urlItem = { id: Date.now(), url: url.value.trim() };
      listOfUrls.unshift(urlItem);
      // Re-calculate pagination
      updatePagination();
      // Paginate to first page
      paginate(1);
      // When the first value is in the list, create submit button
      listOfUrls.length === 1 && createSubmitButton();
    } else {
      // If url is pre-existing, show appropiet error message
      urlError.classList.add('active');
      urlError.textContent = 'Url already in list';
    }
  }
  // Set cookie for page-reload and result page
  document.cookie = `links=${JSON.stringify(listOfUrls)};`;
  // Then prevent the form from being sent by canceling the event
  event.preventDefault();
});

const deleteItem = (id) => {
  // Select and filter out url by its id
  const item = document.querySelector(`[data-key="${id}"]`);
  const updatedList = listOfUrls.filter((item) => item.id !== id);
  // Set new url list
  listOfUrls = updatedList;
  // Remove from DOM
  item.remove();

  document.cookie = `links=${JSON.stringify(listOfUrls)};`;
  // Re-calculate pages
  updatePagination();
  // If last item on page, move back one page else re-render page you're on
  urlList.childElementCount === 0
    ? paginate(activePage - 1)
    : paginate(activePage);
  // If all items are removed, remove submit link to result page
  if (listOfUrls.length === 0) {
    document.getElementById('submitBtn').remove();
  }
};
// Function to display corresponding error
const showError = () => {
  if (url.validity.valueMissing) {
    urlError.classList.add('active');
    // If the field is empty, display the following error message.
    urlError.textContent = 'You need to enter a valid url';
  } else if (url.validity.typeMismatch) {
    urlError.classList.add('active');
    // If the field doesn't contain an url address, display the following error message.
    urlError.textContent = 'i.e. http://example.com, https://example.com';
  }
};

const paginate = (pageNumber) => {
  activePage = pageNumber;
  // Check what page you're on to determine what button to disable
  if (pageNumber === 1 || listOfUrls.length === 0) {
    backPagination.disabled = true;
  } else {
    backPagination.disabled = false;
    backPagination.onclick = () => paginate(pageNumber - 1);
  }
  if (
    pageNumber === Math.ceil(listOfUrls.length / 20) ||
    listOfUrls.length === 0
  ) {
    forwardPagination.disabled = true;
  } else {
    forwardPagination.disabled = false;
    forwardPagination.onclick = () => paginate(pageNumber + 1);
  }
  // Remove active button class
  const allButtons = document.querySelectorAll(`[data-button]`);
  allButtons.forEach((item) => item.classList.remove('active'));
  // Add active button class
  const activeButton = document.querySelector(`[data-button="${pageNumber}"]`);
  activeButton && activeButton.classList.add('active');

  // Render 20 urls per page
  return renderUrlList(
    listOfUrls.slice((pageNumber - 1) * 20, pageNumber * 20)
  );
};

const updatePagination = () => {
  // Calculate number of pages
  const numberOfPages = Math.ceil(listOfUrls.length / 20);
  // Reset pagination
  while (paginationList.firstChild)
    paginationList.removeChild(paginationList.firstChild);

  // Add pagination buttons
  for (let i = 0; i < numberOfPages; i++) {
    const node = document.createElement('li');
    const button = document.createElement('button');
    button.setAttribute('data-button', i + 1);
    button.classList.add('data-button');
    button.innerHTML = i + 1;
    button.onclick = () => paginate(i + 1);
    paginationList.append(node.appendChild(button));
  }
};

// Recive list of 20 urls from given page number
const renderUrlList = (list) => {
  // Remove urls from previous page
  while (urlList.firstChild) urlList.removeChild(urlList.firstChild);
  // Looping out urls
  for (const urlItem of list) {
    // Createing list item and assigning id
    const node = document.createElement('li');
    node.classList.add('url-list-item');
    node.setAttribute('data-key', urlItem.id);
    // Creating a tag with url from list
    const a = document.createElement('a');
    a.classList.add('url-list-link');
    a.setAttribute('href', urlItem.url);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noreferrer');
    a.innerHTML = urlItem.url;
    // Creating delete button with Material icon
    const deleteBtn = document.createElement('button');
    const deleteIcon = document.createElement('img');
    deleteIcon.setAttribute('src', './icon/cancel-black-18dp.svg');
    deleteBtn.classList.add('btn-icon');
    deleteBtn.appendChild(deleteIcon);
    // Adding delete function
    deleteBtn.onclick = () => deleteItem(urlItem.id);
    // Creating edit button with Material icon
    const editBtn = document.createElement('button');
    const editIcon = document.createElement('img');
    editIcon.setAttribute('src', './icon/edit-black-18dp.svg');
    editBtn.classList.add('btn-icon');
    editBtn.appendChild(editIcon);
    // Adding edit function
    editBtn.onclick = () => updateUrl(urlItem.id);

    const div = document.createElement('div');
    div.classList.add('url-button-container');

    // Set the contents of the `li` element created above
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    node.append(a, div);
    urlList.appendChild(node);
  }

  // If list is scrollable, create phantom figure
  urlList.childElementCount > 10
    ? urlList.classList.add('phantom')
    : urlList.classList.remove('phantom');
};

const updateUrl = (id) => {
  // Re-creating validation for url
  const urlReg = /^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
  const item = document.querySelector(`[data-key="${id}"]`);
  // Open prompt to enter new url
  let url = prompt('Enter a new valid url');
  // if canceled
  if (url === null) return;
  // Check if given url was valid
  if (urlReg.test(url)) {
    // check if url existed
    if (listOfUrls.some((item) => item.url === url)) {
      return alert('Url already in list');
    }
    // Select url in list
    const elementsIndex = listOfUrls.findIndex((urlItem) => urlItem.id == id);
    // Create copy of list
    let copyOfUrls = [...listOfUrls];
    // Update url value
    copyOfUrls[elementsIndex] = { ...copyOfUrls[elementsIndex], url: url };
    // Set new list
    listOfUrls = copyOfUrls;

    // Update cookie and DOM
    document.cookie = `links=${JSON.stringify(listOfUrls)};`;
    item.children[0].href = url;
    item.children[0].innerHTML = url;
  } else {
    alert('Invalid format');
  }
};

const createSubmitButton = () => {
  const submitLink = document.createElement('a');
  submitLink.setAttribute('href', 'result.html');
  submitLink.setAttribute('id', 'submitBtn');
  submitLink.classList.add('result');
  submitLink.innerHTML = 'Submit links';
  urlListContainer.appendChild(submitLink);
};
