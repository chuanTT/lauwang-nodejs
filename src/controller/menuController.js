const {
  getBaseUrl,
  multerSingle,
  unlinkFile,
  multer,
  isEmptyObj,
} = require("../comom/functions");
const menuModel = require("../model/menuModel");

const uploadFolder = "/upload/menu/";

const ListMenu = async (req, res) => {
  let baseUrl = getBaseUrl(req);
  let BaseUpload = `${baseUrl}${uploadFolder}`;

  let { limit, per_pages } = req.params;

  limit = parseInt(limit);
  per_pages = parseInt(per_pages);

  const data = await menuModel.getListMenu(BaseUpload, limit, per_pages);

  return res.status(200).json(data);
};

let upload = multerSingle("thumbnail");

const AddMenu = async (req, res) => {
  let { name, price, desc } = req.body;

  if (name && price && desc) {
    upload(req, res, async function (err) {
      // req.file contains information of uploaded file
      // req.body contains information of text fields, if there were any
      if (req.fileValidationError) {
        return res.status(200).json({
          status: 402,
          msg: "upload file error",
        });
      } else if (!req.file) {
        return res.status(200).json({
          status: 402,
          msg: "Please select an image to upload",
        });
      }

      const isCheck = await menuModel.AddMenuModel([
        name,
        price,
        desc,
        req.file.filename,
      ]);

      return res.status(200).json(isCheck);
    });
  } else {
    if(req.file) {
      unlinkFile(`menu/${req.file.filename}`);
    }

    return res.status(200).json({
      status: 402,
      msg: "Vui lòng nhập tất cả các trường",
    });
  }
};

const deleteMenu = async (req, res) => {
  let { id } = req.params;

  if (!id) {
    return res.status(200).json({
      status: 402,
      msg: "Xóa thất bại",
    });
  }

  let oldImg = await menuModel.getNameThumbnail(id);

  if (oldImg) {
    let isCheck = await menuModel.DeletedMenu(id);

    if (isCheck.status === 200) {
      unlinkFile(`menu/${oldImg}`);
    }

    return res.status(200).json(isCheck);
  }
};

const editMenu = (req, res) => {
  let isUploadFile = true;

  upload(req, res, async function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (req.fileValidationError) {
      return res.status(200).json({
        status: 402,
        msg: "upload file error",
      });
    } else if (!req.file) {
      isUploadFile = false;
    }

    let { name, price, desc, id } = req.body;

    const isCheck = await menuModel.editMenuModel(
      [name, price, desc],
      isUploadFile,
      req.file.filename,
      id
    );

    return res.status(200).json(isCheck);
  });
};


const getDetailsMenu = async (req, res) => {
  let baseUrl = getBaseUrl(req);
  let BaseUpload = `${baseUrl}${uploadFolder}`;
  const result = {
    status: 403,
    msg: "Get data error"
  }
  let {id} = req.params;

  if(!id) {
    return res.status(200).json(result);
  }

  let data = await menuModel.getDetailsMenu(id, BaseUpload);

  if(!isEmptyObj(data)) {
    result.status = 200
    result.msg = "Get data sussessfull"
    result.data = data;
  }

  return res.status(200).json(result)
}


module.exports = {
  ListMenu,
  AddMenu,
  deleteMenu,
  editMenu,
  getDetailsMenu
};
