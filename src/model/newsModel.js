// connect database
const pool = require("../config/configDB");
const { getFullName } = require("./userModel");
const { alias, convertDate } = require("../comom/functions");

const typeNews = [1, 2, 3];

const getListNews = async (BaseUpload, type = 0, limit = 10, per_pager = 1) => {
  const data = {
    paging: {},
    data: [],
  };

  if (per_pager <= 0) per_pager = 1;

  let page = (per_pager - 1) * limit;

  let sql = "";
  let result = [];
  let totalResult = [];
  let sqlTotal = "";

  if (typeNews.includes(type)) {
    sql =
      "SELECT endow.ID as id, title as name, representativeImage as image, shortContent, nameNews as type, id_user, created_at FROM endow JOIN kind_of_news ON endow.ID_Type = kind_of_news.id WHERE ID_Type = ? ORDER BY ID DESC LIMIT ?, ?";
    result = [type, page, limit];

    sqlTotal =
      "SELECT endow.ID FROM endow WHERE ID_Type = ? ORDER BY ID DESC";
    totalResult = [type];
  } else {
    sql =
      "SELECT endow.ID as id, title as name, representativeImage as image, shortContent, nameNews as type, id_user, created_at FROM endow JOIN kind_of_news ON endow.ID_Type = kind_of_news.id ORDER BY ID DESC LIMIT ?, ?";
    result = [page, limit];

    sqlTotal =
      "SELECT ID FROM endow ORDER BY ID DESC";
  }

  const [rows] = await pool.execute(sql, result);

  const [total] = await pool.execute(sqlTotal, totalResult);

  if (rows.length > 0) {
    rows.forEach((item) => {
      item["image"] = `${BaseUpload}${item["image"]}`;
      item["alias"] = alias(item["name"]);
      item["type"] = alias(item["type"]);
      item["created_at"] = convertDate(item["created_at"], false);
      data.data.push(item);
    });
  }

  if (total) {
    data.paging.limit = limit;
    data.paging.per_pager = per_pager;
    data.paging.total = total.length;
  }

  return data;
};

const getListTag = async (arrayID) => {
  let data = [];
  let list_tags = arrayID.split(",");
  
  console.log(list_tags);

  let strID = "";
  let listID = [];

  if (Array.isArray(list_tags)) {
    list_tags.forEach((item, index) => {
      if (index > 0) {
        strID += "OR";
      }
      strID += " ID = ? ";
      listID.push(item);
    });
  } else {
    return data;
  }

  const [rows] = await pool.execute(
    `SELECT ID as id, key_word FROM related_keywords WHERE ${strID}`,
    [...listID]
  );

  if (rows.length > 0) {
    rows.forEach((item) => {
      item["alias"] = alias(item["key_word"]);
      data.push(item);
    });
  }

  return data;
};

const getDetailsNews = async (BaseUpload, id) => {
  let data = {};
  if (!id) return data;

  const [rows, fields] = await pool.execute(
    "SELECT endow.ID as id, title as name, representativeImage as image, shortContent, HoTen as full_name, created_at, ID_key_word as key_word, description FROM endow JOIN nhanvien ON endow.id_user = nhanvien.id WHERE endow.ID = ?",
    [id]
  );

  if (rows.length > 0) {
    rows[0].image = `${BaseUpload}${rows[0]["image"]}`;
    rows[0]["created_at"] = convertDate(rows[0]["created_at"]);
    let list_tags = await getListTag(rows[0].key_word);
    rows[0].key_word = list_tags;
    data = rows[0];
  }

  return data;
};

const getSearchNews = async (
  BaseUpload,
  keyword,
  limit = 10,
  per_pager = 1
) => {
  const data = {
    paging: {},
    data: [],
  };

  if (per_pager <= 0) per_pager = 1;

  let page = (per_pager - 1) * limit;

  const [rows, fields] = await pool.execute(
    "SELECT endow.ID as id, title as name, representativeImage as image, shortContent, created_at FROM endow JOIN kind_of_news ON endow.ID_Type = kind_of_news.id WHERE title LIKE CONCAT('%', ?,  '%') ORDER BY ID DESC LIMIT ?, ?",
    [keyword, page, limit]
  );

  const [total] = await pool.execute(
    "SELECT endow.ID FROM endow JOIN kind_of_news ON endow.ID_Type = kind_of_news.id WHERE title LIKE CONCAT('%', ?,  '%')",
    [keyword]
  );

  if (rows.length > 0) {
    rows.forEach((item) => {
      item["image"] = `${BaseUpload}${item["image"]}`;
      item["alias"] = alias(item["name"]);
      data.data.push(item);
    });
  }

  if (total) {
    data.paging.limit = limit;
    data.paging.per_pager = per_pager;
    data.paging.total = total.length;
  }

  return data;
};

const getNewsByTag = async (
  BaseUpload,
  tagAlias = "",
  limit = 10,
  per_pager = 1
) => {
  const data = {
    paging: {},
    data: [],
  };

  if (per_pager <= 0) per_pager = 1;

  let page = (per_pager - 1) * limit;

  const [tag] = await pool.execute(
    "SELECT ID as id FROM related_keywords WHERE alias= ?",
    [tagAlias]
  );

  if (tag.length > 0) {
    let id_tag = tag[0].id;

    const [rows] = await pool.execute(
      "SELECT endow.ID as id, title as name, representativeImage as image, shortContent, created_at FROM endow JOIN kind_of_news ON endow.ID_Type = kind_of_news.id WHERE ID_key_word LIKE CONCAT('%,', ? ) OR ID_key_word LIKE CONCAT(?,',%') OR ID_key_word LIKE CONCAT('%,', ?,  ',%') OR ID_key_word LIKE CONCAT('%', ?, '%') ORDER BY ID DESC LIMIT ?, ?",
      [id_tag, id_tag, id_tag, id_tag, page, limit]
    );

    const [total] = await pool.execute(
      "SELECT endow.ID FROM endow JOIN kind_of_news ON endow.ID_Type = kind_of_news.id WHERE ID_key_word LIKE CONCAT('%,', ? ) OR ID_key_word LIKE CONCAT(?,',%') OR ID_key_word LIKE CONCAT('%,', ?,  ',%') OR ID_key_word LIKE CONCAT('%', ?, '%')",
      [id_tag, id_tag, id_tag, id_tag]
    );

    if (rows.length > 0) {
      rows.forEach((item) => {
        item["image"] = `${BaseUpload}${item["image"]}`;
        item["alias"] = alias(item["name"]);
        data.data.push(item);
      });
    }

    if (total) {
      data.paging.limit = limit;
      data.paging.per_pager = per_pager;
      data.paging.total = total.length;
    }
  }

  return data;
};

const DeletedNews = async (id) => {
  const data = {
    status: 403,
    msg: "Xóa thất bại",
  };

  const [isCheck] = await pool.execute(
    "DELETE FROM `endow` WHERE `endow`.`ID` = ?",
    [id]
  );

  if (isCheck) {
    data.status = 200;
    data.msg = "Xóa thành công";
  }

  return data;
};

const getNameThumbnail = async (id) => {
  let fileName = "";

  let [rows] = await pool.execute(
    "SELECT representativeImage as image FROM endow WHERE ID = ?",
    [id]
  );

  if (rows.length > 0) {
    fileName = rows[0]["image"];
  }

  return fileName;
};

const AddNews = async (data) => {
  let result = {
    status: 402,
    msg: "Thêm dữ liệu thất bại",
  };

  let sql = "INSERT INTO thucdon (title, shortContent, description, image) VALUES (?, ?, ?, ?)";

  let [rows] = await pool.execute(sql, [...data]);

  try {
    result.status = 200;
    result.msg = "Thêm dữ liệu thành công";
  } catch (err) {
    result.stats = 402;
    result.msg = "Thêm dữ liệu thất bại";
  }

  return result;
};

const getNameTypeNews = async (id) => {
  let name = "";

  const [rows] = await pool.execute(
    "SELECT nameNews FROM kind_of_news WHERE ID = ?",
    [id]
  );

  if (rows.length > 0) {
    name = rows[0].nameNews;
  }

  return name;
};

module.exports = {
  getListNews,
  getDetailsNews,
  getSearchNews,
  getNewsByTag,
  getNameThumbnail,
  DeletedNews,
  AddNews
};
