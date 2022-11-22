// connect database
const pool = require("../config/configDB");

const getListMenu = async (BaseUpload, limit = 10, per_pager = 1) => {
  const data = {
    paging: {},
    data: []
  };

  if(per_pager <= 0) per_pager = 1;

  let page = (per_pager - 1) * limit;

  const [rows, fields] = await pool.execute(
    "SELECT Ma as id, Ten as name, gia as price, image, MoTa as descption FROM thucdon ORDER BY Ma DESC LIMIT ?, ?",
    [page, limit]
  );

  const [total] = await pool.execute(
    "SELECT Ma as id FROM thucdon ORDER BY Ma"
  );

  if (rows) {
    rows.forEach((item) => {
      item['image'] = `${BaseUpload}${item['image']}`;
      data.data.push(item);
    })
  }

  if (total) {
    data.paging.limit = limit;
    data.paging.per_pager = per_pager;
    data.paging.total = total.length;
  }

  return data;
};

const AddMenuModel = async (data) => {
  let result = {
    status: 402,
    msg: "Thêm dữ liệu thất bại"
  }

  let sql = "INSERT INTO thucdon (Ten, gia, MoTa, image) VALUES (?, ?, ?, ?)"

  let [rows] = await pool.execute(sql, [...data]);

  try {
    result.status = 200
    result.msg= "Thêm dữ liệu thành công"
  } catch(err) {
    result.status = 402
    result.msg= "Thêm dữ liệu thất bại"
  }

  return result;
}

const DeletedMenu = async (id) => {
  const data = {
    status: 403,
    msg: "Xóa thất bại"
  }

  const [isCheck] = await pool.execute("DELETE FROM `thucdon` WHERE `thucdon`.`Ma` = ?", [id]);

  if(isCheck.affectedRows > 0) {
    data.status = 200;
    data.msg = "Xóa thành công";
  }

  return data;
}

const getNameThumbnail = async (id) => {
  let fileName = '';

  let [rows] = await pool.execute("SELECT image FROM thucdon WHERE Ma = ?", [id]);
  
  if(rows.length > 0) {
    fileName = rows[0]['image'];
  }

  return fileName;
}

const editMenuModel = async (data, isUpload, fileName, id) => {
  let result = {
    status: 402,
    msg: "Upload dữ liệu thất bại"
  }

  let sql = "UPDATE `thucdon` SET `Ten` = ?, `gia` = ?,`MoTa` = ? DATAIMG WHERE `thucdon`.`Ma` = ?";

  if(isUpload) {
    sql = sql.replace('DATAIMG', 'image=?');
    data.push(fileName);
  } else {
    sql = sql.replace('DATAIMG', '');
  }

  data.push(id)

  let [rows] = await pool.execute(sql, [...data]);

  try {
    result.stats = 200
    result.msg= "Upload dữ liệu thành công"
  } catch(err) {
    result.stats = 402
    result.msg= "Upload dữ liệu thất bại"
  }

  return result;
}

module.exports = {
  getListMenu,
  AddMenuModel,
  DeletedMenu,
  getNameThumbnail,
  editMenuModel
};
