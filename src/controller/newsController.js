const { getBaseUrl, unlinkFile } = require("../comom/functions");
const newsModel = require("../model/newsModel");

const uploadFolder = "upload/news/";

const ListNews = async (req, res) => {
  let baseUrl = getBaseUrl(req);
  let BaseUpload = `${baseUrl}/${uploadFolder}`;

  let { type, limit, per_pages } = req.params;

  type = parseInt(type);
  limit = parseInt(limit);
  per_pages = parseInt(per_pages);

  const data = await newsModel.getListNews(BaseUpload, type, limit, per_pages);

  return res.status(200).json(data);
};

const DetailsNews = async (req, res) => {
  let baseUrl = getBaseUrl(req);
  let BaseUpload = `${baseUrl}/${uploadFolder}`;

  let { id } = req.params;

  id = parseInt(id);

  const data = await newsModel.getDetailsNews(BaseUpload, id);

  return res.status(200).json(data);
};

const SearchNews = async (req, res) => {
  let baseUrl = getBaseUrl(req);
  let BaseUpload = `${baseUrl}/${uploadFolder}`;

  let { keyword, limit, per_pages } = req.params;

  limit = parseInt(limit);
  per_pages = parseInt(per_pages);

  const data = await newsModel.getSearchNews(
    BaseUpload,
    keyword,
    limit,
    per_pages
  );

  return res.status(200).json(data);
};

const SearchTagNews = async (req, res) => {
  let baseUrl = getBaseUrl(req);
  let BaseUpload = `${baseUrl}/${uploadFolder}`;

  let { tag, limit, per_pages } = req.params;

  limit = parseInt(limit);
  per_pages = parseInt(per_pages);

  const data = await newsModel.getNewsByTag(BaseUpload, tag, limit, per_pages);

  return res.status(200).json(data);
};

const deleteNews = async (req, res) => {
  let { id } = req.params;

  if (!id) {
    return res.status(200).json({
      status: 402,
      msg: "Xóa thất bại",
    });
  }

  let oldImg = await newsModel.getNameThumbnail(id);

  if (oldImg) {
    let isCheck = await newsModel.DeletedNews(id);

    if (isCheck.status === 200) {
      unlinkFile(`menu/${oldImg}`);
    }

    return res.status(200).json(isCheck);
  }
};

const AddNewsController = async (req, res) => {
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
    } else if (err instanceof multer.MulterError) {
      return res.status(200).json({
        status: 402,
        msg: "Upload file error",
      });
    } else if (err) {
      return res.status(200).json({
        status: 402,
        msg: "Upload file error",
      });
    }

    let { title, shortContent, description, uid, type, keyword } = req.body;

    const isCheck = await menuModel.AddMenuModel([
      name,
      price,
      desc,
      req.file.filename,
    ]);

    return res.status(200).json(isCheck);
  });
};

module.exports = {
  ListNews,
  DetailsNews,
  SearchNews,
  SearchTagNews,
  deleteNews,
  AddNewsController,
};
