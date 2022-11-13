// connect database
const pool = require("../config/configDB");
const { getFullName} = require("./userModel");
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

  if(typeNews.includes(type)) {
    sql = "SELECT endow.ID as id, title as name, representativeImage as image, shortContent, nameNews as type, id_user, created_at FROM endow JOIN kind_of_news ON endow.ID_Type = kind_of_news.id WHERE ID_Type = ? ORDER BY ID DESC LIMIT ?, ?";
    result = [type, page, limit];

    sqlTotal = "SELECT endow.ID FROM endow JOIN kind_of_news ON endow.ID_Type = kind_of_news.id WHERE ID_Type = ? ORDER BY ID DESC";
    totalResult = [type]
  } else {
    sql = "SELECT endow.ID as id, title as name, representativeImage as image, shortContent, nameNews as type, id_user, created_at FROM endow JOIN kind_of_news ON endow.ID_Type = kind_of_news.id ORDER BY ID DESC LIMIT ?, ?";
    result = [page, limit];

    sqlTotal = "SELECT endow.ID FROM endow JOIN kind_of_news ON endow.ID_Type = kind_of_news.id ORDER BY ID DESC";

  }


  const [rows] = await pool.execute(sql,[...result]);

  const [total] = await pool.execute(sqlTotal,[...totalResult]);

  if (rows.length > 0) {
    rows.forEach((item) => {
      item["image"] = `${BaseUpload}${item["image"]}`;
      item['alias'] = alias(item['name']);
      item['type'] = alias(item['type']);
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

const getDetailsNews = async (BaseUpload, id) => {
  let data = {};
  if (!id) return data;

  const [rows, fields] = await pool.execute(
    "SELECT endow.ID as id, title as name, representativeImage as image, shortContent, HoTen as full_name, created_at, description FROM endow JOIN nhanvien ON endow.id_user = nhanvien.id WHERE endow.ID = ?",
    [id]
  );

  if (rows.length > 0) {
    rows[0].image = `${BaseUpload}${rows[0]['image']}`;
    rows[0]['created_at'] = convertDate(rows[0]['created_at']);

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
      item['alias'] = alias(item['name']);
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
  id_tag = 1,
  limit = 10,
  per_pager = 1
) => {
  const data = {
    paging: {},
    data: [],
  };

  if (per_pager <= 0) per_pager = 1;

  let page = (per_pager - 1) * limit;

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
      item['alias'] = alias(item['name']);
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

const getNameTypeNews = async (id) => {
  let name = '';

  const [rows] = await pool.execute(
    "SELECT nameNews FROM kind_of_news WHERE ID = ?",
    [id]
  );

  if(rows.length > 0) {
    name = rows[0].nameNews
  }

  return name;
} 

module.exports = {
  getListNews,
  getDetailsNews,
  getSearchNews,
  getNewsByTag,
};
