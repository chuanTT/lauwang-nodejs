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

module.exports = {
  getListMenu,
};
