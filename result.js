let listOfUrls = [];
let activePage = 1;

const urlList = document.getElementById('url-list');
const paginationList = document.getElementById('pagination');
const backPagination = document.getElementById('back-pagination');
const forwardPagination = document.getElementById('forward-pagination');

window.addEventListener('load', function () {
  // Check if cookie exist with value links
  if (document.cookie.split('; ').find((row) => row.startsWith('links'))) {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('links'))
      .split('=')[1];
    // If links exist in cookie, save them in list array and create submit button
    listOfUrls = JSON.parse(cookieValue);
  }
  // Set pagination
  updatePagination();
  // Render first page
  paginate(1);
});

const paginate = (pageNumber) => {
  activePage = pageNumber;
  // Check what page you're on to determine what button to disable
  if (pageNumber === 1) {
    backPagination.disabled = true;
  } else {
    backPagination.disabled = false;
    backPagination.onclick = () => paginate(pageNumber - 1);
  }
  if (pageNumber === Math.ceil(listOfUrls.length / 20)) {
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

    // Set the contents of the `li` element created above
    node.appendChild(a);
    urlList.appendChild(node);
  }
};
