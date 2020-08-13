## 👻 Quick start

1.  **Compile**

JS files share variable naming and will therefore need to complie separately

```shell
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js script.js --js_output_file script-compiled.js
```

```shell
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js result.js --js_output_file result-compiled.js
```

2.  **Open the source code**

    Your site is now running at `https://phantom-list.netlify.app/`!

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

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
