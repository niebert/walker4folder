console.log("START: main.js started");

//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const ls = require("./loadsave.js");

// walk_directory(directoryPath);

//joining path of directory
// var directoryPath = path.join(__dirname, '.');
var directoryPath = '.';
//passsing directoryPath and callback function
var dirAppend = "";



var dirs = [];
var files = [];

var handle_dir = function (file,pathDir,dirAppend,options) {
  handle_dir_default(file,pathDir,dirAppend,options);
}

var handle_file = function (file,pathFile,dirAppend,options) {
  handle_file_default(file,pathFile,dirAppend);
}

function isFile(pathFile) {
  var extension = path.extname(pathFile);
  console.log("File: '"+pathFile+"' with Extension: '"+extension+"'");
  return extension;
}

function handle_dir_default(file,pathDir,dirAppend,options) {
  dirs.push(dirAppend+file);
}

function handle_file_default(file,pathFile,dirAppend,options) {
  files.push(dirAppend+file);
}

function filter_file(file,pathFile,dirAppend,options) {
  var ign = 0;
  var ign_arr = [".DS_Store",".git"];
  if (options && options.files && options.hasOwnProperty("ignore")) {
    ign_arr = options.files.ignore;
  }
  for (var i = 0; i < ign_arr.length; i++) {
    if (file == ign_arr[i]) {
      ign++;
    }
  }
  if (ign > 0 ) {
    console.log("Ignore file '"+dirAppend+file+"'");
  } else {
    //console.log("handle file '"+file+"'");
    handle_file(file,pathFile,dirAppend);
  }
}

function filter_dir(file,pathFile,dirAppend,options) {
  var ign = 0;
  var ign_arr = [".git"];
  if (options && options.dirs && options.hasOwnProperty("ignore")) {
    ign_arr = options.dirs.ignore;
  }
  for (var i = 0; i < ign_arr.length; i++) {
    if (file == ign_arr[i]) {
      ign++;
    }
  }
  if (ign > 0 ) {
    console.log("Ignore Directory '"+dirAppend+file+"'");
  } else {
    //console.log("handle directory '"+file+"'");
    handle_dir(file,pathFile,dirAppend,options);
  }
}

function check_option(pID,options) {
  var vBoolean = false;
  if (options && options.hasOwnProperty(pID) && (options[pID] == true)) {
    vBoolean = true;
  }
  return vBoolean;
}

function process_file(file,pathFile,dirAppend,options) {
  fs.lstat(pathFile, (err, stats) => {
    if(err) {
      return console.log(err); //Handle error
    } else {
      //console.log("is a directory: "+stats.isDirectory());
      //console.log("is file: "+stats.isFile());
      if (stats.isDirectory()) {
        //console.log("'"+file+"' is a directory ''"+ pathFile + "/'");
        var scandir = dirAppend+file+"/";
        if (check_option("logdirs",options) == true) {
          console.log("DIR:  "+scandir);
        }
        filter_dir(file,pathFile,dirAppend,options);
        walk_directory(pathFile,scandir);
      } else if (stats.isFile()) {
        if (check_option("logfiles",options) == true) {
          console.log("FILE: "+dirAppend+file+" ");
        }
        filter_file(file,pathFile,dirAppend,options);
      }
    }
  });

  //console.log("------isDirectory: "+path+"");
  //console.log(`Is file: ${stats.isFile()}`);
  //console.log(`Is directory: ${stats.isDirectory()}`);
  //console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
}

function log_file_properties(pathFile) {


  let path = pathFile;
  fs.lstat(path, (err, stats) => {

    if(err)
        return console.log(err); //Handle error
    console.log("------isDirectory: "+path+"");
    console.log(`Is file: ${stats.isFile()}`);
    console.log(`Is directory: ${stats.isDirectory()}`);
    console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
    console.log(`Is FIFO: ${stats.isFIFO()}`);
    console.log(`Is socket: ${stats.isSocket()}`);
    console.log(`Is character device: ${stats.isCharacterDevice()}`);
    console.log(`Is block device: ${stats.isBlockDevice()}`);
  });
}

function walk_directory (directoryPath,dirAppend,options) {
  dirAppend = dirAppend || "";
  fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      //listing all files using forEach
      files.forEach(function (file) {
          // Do whatever you want to do with the file
          //isFile(directoryPath+"/"+file);
          //log_file_properties(directoryPath+"/"+file);
          process_file(file,directoryPath+"/"+file,dirAppend,options);
      });
  });

}

function save_scanned() {
  var vFileName = this.filename || 'scanned_file.json';
  ls.save_json(vFileName,{'dirs':dirs,'files':files})
  console.log("DONE: save JSON in file '" + pFileName + "'");
}


function timeout_save_scanned(pFileName) {
  if (pFileName) {
    this.filename = pFileName;
  }
  setTimeout(save_scanned,1000);
}


function removeExtension4File(pFilename) {
	var vFilename = pFilename || "";
	if (vFilename != "") {
		vFilename = vFilename.replace(/\.[^/.]+$/, "");
	};
	return vFilename
}

function walker4folder (pDirectoryPath,pHandler_File,pHandler_Dir,options) {
  var vDirPath = pDirectoryPath || directoryPath;
  handle_dir = pHandler_Dir || handle_dir_default;
  handle_file = pHandler_File || handle_file_default;
  walk_directory (vDirPath,"",options);
}

function isString(pObj) {
  return (typeof(pObj) == "string");
}

function getExtension(pFilePath) {
  var vExt = "";
  if (pFilePath) {
    vExt = pFilePath.split('.').pop();
  }
  return vExt;
}


function getName4URL(pFilePath) {
  var vNameExt = getNameExt4URL(pFilePath);
  var vName = vNameExt;
  if (vNameExt.indexOf(".")>0) {
    vName = vName.substring(0,vNameExt.lastIndexOf("."))
  };
  console.log("getName4URL('"+pFilePath+"') return='"+vName+"'");
  return vName;
};


module.exports = {
  "filename": "scanned_file.json",
  "dirs": dirs,
  "files": files,
  "walk_directory": walk_directory,
  "walker4folder": walker4folder,
  "save_scanned": timeout_save_scanned,
  "load_file": ls.load_file,
  "save_file": ls.save_file,
  "load_json": ls.load_json,
  "save_json": ls.save_json,
  "remove_extension": removeExtension4File,
  "is_string": isString,
  "get_extension": getExtension,
  "get_name4url": getName4URL
};
