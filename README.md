# Walker4Folder <div id4marker="version" style="display: inline-block">1.0.2</div>
Tree walker for folders ***(Walker4Folder)*** with recursive runs over subdirectories. The `walker4folder` can be used to perform specific task like search and replace on a regular basis on a specific directory. On a Linux system the `walker4folder` can be used to perform standard task in a [CronJob](https://en.wikipedia.org/wiki/Cron) or for update HTML pages to import a new version of an updated library.

## Installation
You you install `walker4folder` in your existing NodeJS project or create you own repository for a specific search and replace task in folder and subfolder

### Installation for an exiting Repository
If you have already a repository in which you want to use the `walker4folder` just call the `npm install`:

`npm install walker4folder`

### Create a new Repository
If you do not have a repository and you just want create script that searches files (recursively) into subdirectory and do something with some or all files, then perform the following steps for installation fpr your computer or operating system. The following commands are performed on shell/terminal:
* Create a new directory e.g. `my_walker/` e.g. with `mkdir my_walker`
* Change to that directory with `cd my_walker`
* Initialize repository with `npm init` and fill the variables. After init you will have a `package.json` for your directory `my_walker`.
* Install the package with `npm install walker4folder`
* Create a main NodeJS script `index.js` in the repository.
```javascript
const w4f = require('walker4folder');
w4f.walker4folder();
w4f.save_scanned();
```
The script above scans the current directory and all subdirectories and saves all found files and folders in the file `scanned_file.json`. You can create more than one
 `walker4folder` for different tasks and different folders.

## Usage
Create a file e.g. `my_walker.js` and enter one of the following code options according to your requirements of the walker.

### Start the Walker4Folder
Assuming you have at least one script in your repository in which the `walker4folder` was install. The default script should be `index.js`. Then you can start the search and replace for a specific folder by running the script with.
`node index.js`
If no directory parameter is provided to the `walker4folder` then the current directory will be scanned form which the script was called.  

### Scanned the current directory
Now we look into a script and explain how the `walker4folder` script can be
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
        "libs"
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

### File and Directory Handlers
The `walker4folder` has a default file handler and a default directory handler, that pushes the found files and folders to the JSON. The predefined file handler and folder holder is implemented directly

```javascript
const w4f = require('walker4folder');

let scan_json = {
    "dirs": [],
    "files": []
}

function handle_dir(file,pathFile,dirAppend,options) {
  // e.g. dirAppend="libs" and file="js"
  scan_json.dirs.push(dirAppend+file);
  // pushes the relative path "libs/js" to array 'dirs'
  // complete path is available in pathFile="./src/libs/js"
}

function handle_file(file,pathFile,dirAppend,options) {
  // e.g. dirAppend="libs/js/" and file="mylib.js"
  scan_json.files.push(dirAppend+file);
  // pushes relative path "libs/js/mylib.js" to array 'files'
  //the full path is available with pathFile="./src/libs/js/mylib.js"
}

// start scan at directory "./src" and
// call the walker4folder with file and directory handlers
w4f.walker4folder("./src",handle_file,handle_dir);
w4f.save_scanned();
```

### Select Files according to Extensions
The following application of `walker4folder` explains the selection of a specific files that allows to perform a specific search-and-replace task for all selected files. We explain the application by a specific use-case:

* Search all `html` files in the folder `www/` and all subdirectories.
* load those `html` files and perform the search-and-replace tasks for each `html` file
* save the file back to the file system.

At first we filter all files with the file handler.

```javascript
const w4f = require('walker4folder');

function my_handle_file(file,pathFile,dirAppend,options) {

  var ext = w4f.get_extension(pathFile);
  if (ext == "html") {
    console.log("Found File:  '" + pathFile + "' with extension '" + ext + "'");
  }
}

w4f.walker4folder("./www",my_handle_file);
```
The `console.log()` generates the following messages for each found file. It may look like this:
```
Found File: 'www/index.html' with extension 'html'
Found File: 'www/other/myfile1.html' with extension 'html'
Found File: 'www/other/myfile2.html' with extension 'html'
```

### Search and Replace in all Selected Files
In the last script above `html` files are filtered from all found files
Now we replace the `console.log` by
* `load_file()`,
* `search_replace()` and
* `save_file()`
operation. The script could look like this. The following task of the script is to replace the import of Javascript library  

```javascript
const w4f = require('walker4folder');

function replace_in_file(file,pathFile,dirAppend,options) {

  var ext = w4f.get_extension(pathFile);
  // Select HTML files only with extension "html" e.g. "index.html"
  if (ext == "html") {
    console.log("Found File:  '" + pathFile + "' with extension '" + ext + "'");
    // load file
    var vContent = w4f.load_file(pathFile);
    // replace the library name "lib-v0.7.1.min.js" by "lib-v1.0.4.js" in HTML
    vContent = vContent.replace("lib-v0.7.1.min.js","lib-v1.0.4.js");
    // save the modified file will the updated content to e.g. "index.html.out".
    w4f.save_file(pathFile+".out",vContent);
    // remove ".out" if you want to save in the same file.
  }
}

w4f.walker4folder("./www",my_handle_file);
```

### Ignore Files and Folders
You can ignore specific files and folders with the options.
```javascript
let options = {
  "files": {
    "ignore": [".DS_Store",".gitignore"]
  },
  "dirs": {
    "ignore": ["node_modules",".git"]
  }
};
```
The files and folders that are mentioned in the ignore array will not be scanned. If you want to filter in a more advanced way use the file handler or the directory handlers and apply regular expressions on file, path or extension of files. In the example above two files `.DS_Store` and `.gitignore`

### Recursion Depth - Directories
You might want to search in the current directory only or just in the start directory e.g. `src/`. This is the recursion depth 0.  If you want to scan files in the start directory  (e.g. `src/`) in the subdirectories one level deeper (e.g. `src/md/` and `src/html`) but not the subdirectories 2 levels deeper (e.g. `src/md/input/` and `src/html/output/`) then your recursion depths is 1.

The function `get_recursion_depth(pPath)` returns the recursion depth of the relative path from the start directory.

The following script shows how you can check the current of file or directory depending on the returned recursion depth you can decide want to do depending on the returned recursion depth of the file or folder.

```javascript
const w4f = require('walker4folder');

function my_handle_file(file,pathFile,relativePath,options) {

  var rd = w4f.get_recursion_depth(relativePath);
  if (rd <= 2) {
    console.log("Found File:  '" + pathFile + "' with recursion depth " + rd + "." );
  }
}

w4f.walker4folder("./www",my_handle_file);
```

### Scanned a specific directory
This call of the function `walker4folder` runs over a specific directory `./src` with directory name as first parameter.
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

function my_handle_file(file,pathFile,dirAppend,options) {
  console.log("File:         '" + file + "'");
  console.log("Path File:    '" + pathFile + "'");
  console.log("Subdirectory: '" + dirAppend + "'");
}

function my_handle_dir(file,pathDir,dirAppend,options) {
  console.log("Directory:           '" + file + "'");
  console.log("Path Dir:            '" + pathDir + "'");
  console.log("Parent Subdirectory: '" + dirAppend + "'");
}

w4f.walker4folder("../src",my_handle_file);
w4f.walker4folder("../src",my_handle_file,my_handle_dir);
w4f.walker4folder("../src",null,my_handle_dir);

```
* The first call `w4f.walker4folder("../src/",my_handle_file)` of the `walker4folder` replaces just the file handler with you own handler `my_handle_file`.
* The second call `w4f.walker4folder("../src/",my_handle_file,my_handle_dir)` of the `walker4folder` replaces both the file handler and the directory handler with you own file handler `my_handle_file` and directory handler `my_handle_dir`.
* The third call `w4f.walker4folder("../src/",my_handle_file);` of the `walker4folder` replaces just the directory handler with you own handler `my_handle_dir`. The second parameter for the file handler is `null`, so the default file handler is used that pushes the found files to the JSON that can be saved with `w4f.save_scanned()`.


## Options of walker4folder
The 4th parameter of `w4f.walker2folder()` call contains options. If you do not use the file handlers or directory handlers provide `null` as argument.

### Console Log for all visited files and directories
The option `options.logfiles` is a boolean variable that defines if the folder visitor `walker4folder` reports all visited files to the console i.e. a command `console.log()` is called that reports that a specific file was found by the folder visitor. That does not mean that the file is processed or modified by the file handler e.g. `my_handle_file()`. The options are also passed to the file handler as 4th parameter so you can use the options also for your file handler.

```javascript
const w4f = require('walker4folder');

function my_handle_file(file,pathFile,dirAppend,options) {
  console.log("File:         '" + file + "'");
  console.log("Path File:    '" + pathFile + "'");
  console.log("Subdirectory: '" + dirAppend + "'");
}

let options = {
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

function my_handle_dir(file,pathDir,dirAppend,options) {
  console.log("Comment: "+options.comment);
  console.log("Directory:           '" + file + "'");
  console.log("Path Dir:            '" + pathDir + "'");
  console.log("Parent Subdirectory: '" + dirAppend + "'");
}

var options = {
  "logdirs":  true,
  "comment": "found directory";
};

w4f.walker4folder("../src",null,my_handle_dir,options);

```

## API of Walker4Folder

### Filename for JSON `w4f.filename`
The attribute `w4f.filename` contains the filename, which is used to save the scanned files and folders as a JSON. Default filename is `w4f.filename = "scanned_file.json"`

### Function `w4f.walker4folder()`
The function `w4f.walker4folder()` starts the scan process of the directory. See tutorial above to start `w4f.walker4folder()` with specific parameters.

### Function `w4f.save_scanned()`
If `w4f.walker4folder()` is started without file and directory handlers is uses the default file and directory handlers that populated a JSON with the files and folders that are found durch the walk through the folders and its subdirectory. `w4f.save_scanned()` saves the JSON into the file with the filename `w4f.filename = "scanned_file.json"`. With `w4f.walker4folder("myfiles.json")` you can define the output filename for the JSON.

### Function `w4f.()`
The function ``
"load_file": ls.load_file,

### Function `w4f.load_file()`
The function `load_file(pFileName)` loads a text or string from a specific the file with name `pFileName`. File types can be any text files e.g. with the extension:
* `html`
* `xml`
* `js`
* `txt`
* `svg`
* ....
**Remark:** Do not perform the `load_file()`  on binary files.

### Function `w4f.save_file()`
The function `save_file(pFileName,pContent)` saves a text file with the string variable `pContent` into the file with name `pFileName`.
```javascript
var vContent = "My name is Bond, James Bond";
w4f.save_file("person.json",vContent);
```
**Remark:** Do not perform the `save_file()`  on binary files.

### Function `w4f.load_json()`
The function `load_json(pFileName)` loads a JSON from a specific the file with name `pFileName`.
```javascript
var vJSON  = w4f.load_json("person.json");
// e.g.
// vJSON = {
//  "firstname": "James",
//   "lastname": "Bond",
//   "age":45
// }

```

### Function `w4f.save_json()`
The function `save_json(pFileName,pJSON)` saves a JSON `pJSON` into the file with name `pFileName`.
```javascript
var vJSON = {
  "firstname": "James",
  "lastname": "Bond",
  "age":45
}

w4f.save_json("person.json",vJSON);
```

### Function `w4f.remove_extension()`
The function `remove_extension(pPath)` removes the extension from a file path. That is useful if the scan of folders reads files and creates a new file for the found extension.
```javascript
var name = w4f.remove_extension("/home/user/documents/readme.html");
// "name" contains filename without extension "/home/user/documents/readme"
```

### Function `w4f.is_string()`
The function `is_string(pVar)` checks if a provided variable `pVar` is a string.
```javascript
var bool1 = w4f.is_string("/home/user/documents/readme.html");
// vbool1 = true
var bool2 = w4f.is_string(67873);
// vbool2 = false
```

### Function `w4f.get_extension()`
The function `w4f.get_extension()` extracts the extension for a provided URL of path for the file.
```javascript
var name = w4f.get_extension("/home/user/documents/readme.html");
// name="html"
```

### Function `w4f.get_name4url()`
The function `get_name4url()` extracts the name without the extension for a provided URL of path to a filename.
```javascript
var name = w4f.get_name4url("/home/user/documents/readme.html");
// name="readme"
```

### Function `w4f.get_nameext4url()`
The function `get_nameext4url()` extracts the name and extension for a provided URL of path to a filename.
```javascript
var name = w4f.get_nameext4url("/home/user/documents/readme.html");
// name="readme.html"
```
