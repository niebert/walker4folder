const w4f = require("../src/main.js");


function my_handle_file(file,pathItem,dirAppend) {
  console.log("File:         '" + file + "'\n" +
              "Path File:    '" + pathItem + "'\n" +
              "Subdirectory: '" + dirAppend + "'");
}

function my_handle_dir(file,pathItem,dirAppend) {
  console.log("Directory:           '" + file + "'\n" +
              "Path Dir::    '" + pathItem + "'\n" +
              "Parent Subdirectory: '" + dirAppend + "'");
}

function replace4file(file,pathItem,dirAppend) {
  if (w4f.get_extension(file) == "html") {
    var vContent = w4f.load_file(pathItem);
    vContent = vContent.replace("v0.7.1.min","v1.0.4-master");
    console.log("Replaced: "+vContent);
    w4f.save_file(pathItem+".out",vContent);
  }
}
//w4f.walker4folder();
//w4f.walker4folder("./src");
//w4f.walker4folder("./src",my_handle_file);
//w4f.walker4folder("./src",my_handle_file,my_handle_dir);
//w4f.walker4folder("./node_modules",my_handle_file,my_handle_dir);
w4f.walker4folder("./tests",replace4file,my_handle_dir);
