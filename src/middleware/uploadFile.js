const multer = require("multer");
const {initStorage, imageFilter} = require("../comom/functions");


let storage = initStorage('menu/');

let uploadMenu = multer({
  storage: storage,
  fileFilter: imageFilter,
});

module.exports = {
    uploadMenu
}


