## 👻 Quick start

1.  **Compile**

JS files share variable naming, and will therefore need to complie separately

```shell
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js script.js --js_output_file script-compiled.js
```

```shell
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js result.js --js_output_file result-compiled.js
```

2.  **A public link to the final app**

    Your site is now running at `https://phantom-list.netlify.app/`!

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see

    .
    ├── icon
    ├── compiler.jar
    ├── COPYING
    ├── index.html
    ├── result.html
    ├── script.js
    ├── result.js
    ├── script-compiled.js
    ├── result-compiled.js
    ├── style.css
    └── README.md

1.  **`/icon`**: This directory contains icons used on the website

2.  **`compiler.jar`**: Closure Compiler made by Google.

3.  **`COPYING`**: License from Google Closure Compiler.

4.  **`README.md`**: A text file containing useful reference information about your project.

# TDD

## Introduction

The task at hand was to develop a JavaScript web app that manages a list of bookmarks submitted by a user.

## Solution Requirements

The app needed to be able to store multiple pages of 20 bookmarks with navigation fetures to prevent a slow user experiance.

It was essential that the input form was validating and that the user was greeted by a result page at the end of their submissions.

## Solution

Initially, I started with the input field and creating its validation. I took advantage of the native ValidityState on the input field to help me determine if the field was empty upon submission or if the native URL format was wrong. This gave me a good ground to build my validation on but I also had to validate if the input already existed in the list. When creating a bookmark I stored its value together with a timestamp of creation as id `{ url, id }`. This object was then finally stored in the list array `Array<{url, id}>`. To validate if the submitted value already existed I took advantage of the `some()` method to return a boolean value if it was found or not.

The second step was to render the list. To determine the items to render per page I used the `slice()` method to calculate what items in the `Array<{url, id}>`. When rendering each item I assign the id to the list item with a `data-key` attribute. This key helped when editing or removing an item as it will correspond to the one in the `Array<{url, id}>`.

To send the list over to the result page I maintained the list in a stringified cookie, updating as you add/edit/delete in the list. Once arriving at the result page you're greeted and the list is fetched from the cookie and rendered to display your submissions. This cookie comes in handy when moving back to the overview page as it also checks if there's a cookie and render its content.

## Limitations

Although the link to the result page is only rendered when there's an item in the list, you'll always be able to go directly to the result page in the browser. This could be prevented by checking the existence of the cookie before rendering the result page.

As a design feature, I decided to truncate longer links with text-overflow to prevent line break and maintain the minimalistic design. This may however be an issue if the user wishes to view the link in full.
