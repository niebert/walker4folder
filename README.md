# Walker4Folder
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
The output file has the filename `scanned_file.json`. The next script can read the JSON and process the files or analyze the content of the scanned directories.

### Scanned a specific directory
This call of the function `walker4folder` runs over a specific directory `./src` with as first parameter.
```javascript
const w4f = require('walker4folder');
w4f.walker4folder("./src");
w4f.save_scanned();
```
The function `save_scanned()` stores again the scanned folders and files into a JSON for further processing. The output file has again the filename `scanned_file.json`.

If you provide an argument for `w4f.save_scanned()` you can define the filename for the JSON the scanned files are stored.
```javascript
const w4f = require('walker4folder');
w4f.walker4folder("./src");
w4f.save_scanned("./found_files.json");
```

### Scanned a specific directory with Callback function  
If you want to handle files, or filter files then you can provide a specific callback functions for files and folders. The following callback function do nothing special. They just provide the output of the paramters.

```javascript
const w4f = require('walker4folder');

function my_handle_file(file,pathItem,dirAppend,options) {
  console.log("File:         '" + file + "'");
  console.log("Path File:    '" + pathItem + "'");
  console.log("Subdirectory: '" + dirAppend + "'");
}

function my_handle_dir(file,pathItem,dirAppend,options) {
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

## Options of walker4folder
The 4th parameter of `w4f.walker2folder()` call contains options. If you do not use the file handlers or directory handlers provide `null` as argument.

### Console Log for all visited files and directories
The option `options.logfiles` is a boolean variable that defines if the folder visitor `walker4folder` reports all visited files to the console i.e. a command `console.log()` is called that reports that a specific file was found by the folder visitor. That does not mean that the file is processed or modified by the file handler e.g. `my_handle_file()`. The options are also passed to the file handler as 4th parameter so you can use the options also for your file handler.

```javascript
const w4f = require('walker4folder');

function my_handle_file(file,pathItem,dirAppend,options) {
  console.log("File:         '" + file + "'");
  console.log("Path File:    '" + pathItem + "'");
  console.log("Subdirectory: '" + dirAppend + "'");
}

var options = {
  "logfiles": true,
  "logdirs":  false
};
w4f.walker4folder("../src",my_handle_file);
w4f.walker4folder("../src",my_handle_file,my_handle_dir);
w4f.walker4folder("../src",null,my_handle_dir);

```

Furthermore `options.logdirs` is a boolean variable that defines if the folder visitor `walker4folder` reports all visited folders to the console i.e. with the command `console.log()`. The options are also passed to the directory handler e.g. `my_handle_dir()` as 4th parameter and therefore you can use the options defining specific tasks the directory handler should perform depending on the settings in the options.

```javascript
const w4f = require('walker4folder');

function my_handle_dir(file,pathItem,dirAppend,options) {
  console.log("Comment: "+options.comment)
  console.log("Directory:           '" + file + "'");
  console.log("Path Dir:            '" + pathItem + "'");
  console.log("Parent Subdirectory: '" + dirAppend + "'");
}

var options = {
  "logdirs":  true,
  "comment": "found directory";
};

w4f.walker4folder("../src",null,my_handle_dir,options);

```
