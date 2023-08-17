// connect database
const pool = require("../config/configDB");

const getFullName = async (id) => {
  let FullName = "";

  const [rows] = await pool.execute(
    "SELECT HoTen as name FROM nhanvien WHERE id = ?",
    [id]
  );

  if (rows) {
    FullName = rows[0].name;
  }

  return FullName;
};

const getListUser = async (id, limit, per_pager, BaseUpload) => {
  const data = {
    paging: {},
    data: [],
  };

  if (per_pager <= 0) per_pager = 1;

  let page = (per_pager - 1) * limit;

  const [rows] = await pool.execute(
    "SELECT nhanvien.user_name,nhanvien.id,avatar, HoTen, NgaySinh, SDT, DiaChi,deleted, role.nameRole FROM nhanvien JOIN role ON nhanvien.ID_role = role.ID WHERE nhanvien.id <> ? ORDER BY ID DESC LIMIT ?, ?",
    [id, page.toString(), limit.toString()]
  );

  const [total] = await pool.execute(
    "SELECT nhanvien.id FROM nhanvien JOIN role ON nhanvien.ID_role = role.ID WHERE nhanvien.id <> ?",
    [id]
  );

  if (rows.length > 0) {
    rows.forEach((item) => {
      item["avatar"] = `${BaseUpload}${item["avatar"]}`;
      data.data.push(item);
    });
  }

  if (total) {
    data.paging.limit = limit;
    data.paging.per_pager = per_pager;
    data.paging.total = total.length;
  }

  return data;

}

const login = async (user_name, BaseUpload) => {
  let data = {}

  const [user] = await pool.execute(
    "SELECT id, MatKhau as password, ID_role as role FROM nhanvien WHERE user_name = ?",
    [user_name]
  );

  if(user.length > 0) {
    user[0].avatar = `${BaseUpload}${user[0].avatar}`;
    data = user[0]
  }

  return data;
};

const getInforUser = async (id, BaseUpload) => {
  let data = {}

  const [user] = await pool.execute(
    "SELECT id, HoTen as full_name, avatar, ID_role as role FROM nhanvien WHERE id = ?",
    [id]
  );

  if(user.length > 0) {
    user[0].avatar = `${BaseUpload}${user[0].avatar}`;
    data = user[0]
  }

  return data;
}

module.exports = {
  getFullName,
  login,
  getListUser,
  getInforUser
};
