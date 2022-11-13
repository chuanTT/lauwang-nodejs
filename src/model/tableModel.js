// connect database
const pool = require("../config/configDB");

const AddTableBook = async (data) => {
  let result = false;

  const [rows] = await pool.execute(
    "INSERT INTO order_temp(ho_ten, sdt, ngay, gio, dia_chi, num_adult, num_child, note) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
    [...data]
  );

  if (rows) {
    result = true;
  }

  return result;
};

const getListBase = async () => {
  let data = [];

  const [rows, fields, erorr] = await pool.execute(
    "SELECT Ma as id, DiaChi as name FROM coso"
  );

  if (rows.length > 0) {
    data = rows;
  }

  return data;
};

module.exports = {
  AddTableBook,
  getListBase,
};
