# walker4folder
Tree walker for folders with recursive runs over subdirectories

## Installation
`npm install walker4folder`

## Usage
Create a file e.g. `my_walker.js` and enter one of the following code options according to your requirements of the walker.

### Scanned the current directory
The function `walker4folder` runs over the current directory with a call without parameter.
```javascript
const w4f = require('walker4folder');
w4f.walker4folder();
w4f.save_scanned();
```
The function `save_scanned()` stores the scanned folders and files into a JSON for further processing. The JSON file would look like this:
```json
{
    "dirs": [
        "src"
    ],
    "files": [
        "package-lock.json",
        "package.json",
        "scanned_file.json",
        "libs/loadsave.js",
        "libs/main.js"
    ]
}
```
The output file has the filename `scanned_file.json`.

### Scanned a specific directory
This call of the function `walker4folder` runs over a specific directory `./src` with as first parameter.
```javascript
const w4f = require('walker4folder');
w4f.walker4folder("./src");
w4f.save_scanned();
```
The function `save_scanned()` stores again the scanned folders and files into a JSON for further processing. The output file has again the filename `scanned_file.json`.

### Scanned a specific directory with Callback function  
If you want to handle files, or filter files then you can provide a specific callback functions for files and folders. The following callback function do nothing special. They just provide the output of the paramters.

```javascript
const w4f = require('walker4folder');

function my_handle_file(file,pathItem,dirAppend) {
  console.log("File:         '" + file + "'");
  console.log("Path File:    '" + pathItem + "'");
  console.log("Subdirectory: '" + dirAppend + "'");
}

function my_handle_dir(file,pathItem,dirAppend) {
  console.log("Directory:           '" + file + "'");
  console.log("Path Dir:            '" + pathItem + "'");
  console.log("Parent Subdirectory: '" + dirAppend + "'");
}

w4f.walker4folder("../src",my_handle_file);
w4f.walker4folder("../src",my_handle_file,my_handle_dir);
w4f.walker4folder("../src",null,my_handle_dir);

```
* The first call `w4f.walker4folder("../src/",my_handle_file)` of the `walker4folder` replaces just the file handler with you own handler `my_handle_file`.
* The second call `w4f.walker4folder("../src/",my_handle_file,my_handle_dir)` of the `walker4folder` replaces both the file handler and the directory handler with you own file handler `my_handle_file` and directory handler `my_handle_dir`.
* The third call `w4f.walker4folder("../src/",my_handle_file);` of the `walker4folder` replaces just the directory handler with you own handler `my_handle_dir`
