let listOfUrls = [];

const url = document.getElementById("url");
const urlList = document.getElementById("url-list");
const paginationList = document.getElementById("pagination");

window.addEventListener("load", function () {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("links"))
    .split("=")[1];

  listOfUrls = JSON.parse(cookieValue);

  updatePagination();
  paginate(1);
});

const paginate = (page_number) => {
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

    // Set the contents of the `li` element created above
    node.append(a);
    urlList.append(node);
  }
};
