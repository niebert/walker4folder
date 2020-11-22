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
    vContent = vContent.replace("aframe-v0.7.1.min.js","aframe-v1.0.4.js");
    console.log("Replaced: "+vContent);
    out_filename = w4f.remove_extension(pathItem) + "_out.html";
    w4f.save_file(out_filename,vContent);
  }
}
//w4f.walker4folder();
//w4f.walker4folder("./src");
//w4f.walker4folder("./src",my_handle_file);
//w4f.walker4folder("./src",my_handle_file,my_handle_dir);
//w4f.walker4folder("./node_modules",my_handle_file,my_handle_dir);
//w4f.walker4folder("../../WebVR/HuginSample/docs",replace4file,my_handle_dir);
w4f.walker4folder("./tests",replace4file,my_handle_dir);
