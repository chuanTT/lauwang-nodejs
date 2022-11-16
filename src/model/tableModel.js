// connect database
const pool = require("../config/configDB");
const {isEmptyObj, convertDate} = require("../comom/functions");

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

// /oke
const getTablePending = async (limit = 10, per_page = 1) => {
  const data = {
    paging: {},
    data: [],
  };

  if (per_page <= 0) per_page = 1;

  let page = (per_page - 1) * limit;

  const [rows] = await pool.execute(
    `SELECT order_temp.ma as id, ho_ten as full_name, sdt as phone, ngay as date, gio as 
  hours, dia_chi as base, coso.DiaChi as name_base, num_adult, num_child, note FROM coso JOIN order_temp ON coso.Ma = order_temp.dia_chi ORDER BY order_temp.ma DESC LIMIT ?, ?`,
    [page, limit]
  );

  const [total] = await pool.execute(
    `SELECT order_temp.ma as id FROM coso JOIN order_temp ON coso.Ma = order_temp.dia_chi ORDER BY order_temp.ma DESC`
  );

  if (total.length > 0) {
    data.paging.limit = limit;
    data.paging.per_pager = per_page;
    data.paging.total = total.length;
  }

  if (rows.length > 0) {
    for(let item of rows) {
      let id = await GetIDByBase(item.base);

      data.data.push({...item,"list_table": id})
    }

    await Promise.all(data.data);
  } 

  return data;
};

// oke
const tableListPay = async (id_base, type = 0, limit = 10, per_page = 1) => {
  const data = {
    paging: {},
    data: [],
  };

  if (per_page <= 0) per_page = 1;

  let page = (per_page - 1) * limit;

  if (id_base) {
    let sql = "";
    let resultSql = [];

    let sqlTotal = "";
    let resultSqlTolal = [];

    switch (type) {
      case 0:
        sql =
          "SELECT MaBan as id, SoNguoiToiDa,DiaChi, TinhTrang FROM ban, coso  WHERE ban.MaCS = coso.Ma AND TinhTrang=? AND coso.Ma = ? ORDER BY MaBan DESC LIMIT ?, ?";
        resultSql = [type, id_base, page, limit];

        sqlTotal =
          "SELECT MaBan as id FROM ban, coso  WHERE ban.MaCS = coso.Ma AND TinhTrang=? AND coso.Ma = ?";
        resultSqlTolal = [type, id_base];
        break;
      case 1:
        sql = `SELECT khachhang.MaCS,khachhang.id,khachhang.MaBan,khachhang.HoTen,khachhang.SDT,khachhang.Ngay, khachhang.Gio ,coso.DiaChi,ban.TinhTrang,num_adult,num_child 
          FROM khachhang, coso, ban WHERE khachhang.MaCS = coso.Ma AND ban.MaBan = khachhang.MaBan AND khachhang.MaCS =? LIMIT ?, ?`;
        resultSql = [id_base, page, limit];

        sqlTotal =
          "SELECT khachhang.MaCS FROM khachhang, coso, ban WHERE khachhang.MaCS = coso.Ma AND ban.MaBan = khachhang.MaBan AND khachhang.MaCS = ?";

          resultSqlTolal = [id_base];
        break;
    }

    const [rows] = await pool.execute(sql,resultSql);
  
    const [total] = await pool.execute(sqlTotal, resultSqlTolal);
  
    if (rows.length > 0) {
      data.data = rows;
    }
  
    if (total.length > 0) {
      data.paging.limit = limit;
      data.paging.per_pager = per_page;
      data.paging.total = total.length;
    }
  
    return data;
  }
};

const GetIDByBase = async (id) => {
  let data = [];

  const [rows] = await pool.execute("SELECT MaBan as id FROM ban WHERE MaCS = ? AND TinhTrang = 0", [id]);
  
  if(rows.length > 0) {
    data = rows.reduce((total, curent) => [...total, curent.id], [])
  }

  return data;
}

const deleteOrder = async (id) => {
  let isDelete = false;

  const [susses] = await pool.execute("DELETE FROM order_temp WHERE ma=?", [id]);

  if(susses) {
    isDelete = true;
  }

  return isDelete;
}

const susses_table = async (id_temp, id_table) => {
  let data = {
    status: 403,
    msg: "Duyệt bàn không thành công"
  }

  if(id_temp && id_table) {
    let order_temp = await getOneOrderTemp(id_temp);

    if(!isEmptyObj(order_temp)) {
      HoTen = order_temp['ho_ten'];
      SDT = order_temp['sdt'];
      ngay = order_temp['ngay'];
      gio = order_temp['gio'];
      Dia_chi = order_temp['dia_chi'];
      num_adult = order_temp['num_adult'];
      num_child = order_temp['num_child'];
      note = order_temp['note'];


      AddGuest([HoTen, SDT, ngay, gio, Dia_chi, num_adult, num_child, note]);

      deleteOrder(id_temp);

      updateTable(Dia_chi);

      data.msg = "Duyệt bàn thành công";
      data.status = 200;
    }
  }

  return data;
}

const AddGuest = async (data) => {
  let isInsert = false;

  const [check] = await pool.execute("INSERT INTO khachhang VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [...data])

  if(check) {
    isInsert = true
  }

  return isInsert;
}

const getOneOrderTemp = async (id_temp) => {
  let result = {}
  const [data] = await pool.execute("SELECT * FROM order_temp WHERE ma = ?", [id_temp]);

  if(data.length > 0) {
    result = data[0];
  }

  return result;
}

const updateTable = async (id, type = 1) => {
  const [update] = await pool.execute("UPDATE `ban` SET `TinhTrang` = b'?' WHERE `ban`.`MaBan` = ?", [type, id]);
  let isUpdate = false;
  if(update) {
    isUpdate = true;
  }

  return isUpdate;
}

const payTable = async (id) => {
  let checking = false;
  const [check] = await DeleteGuest(id);

  if(check) {
    checking = true;
  }

  return checking;
}

const getGuestTable = async (id) => {
  let ma = 0;
  const [row] = await pool.execute("SELECT MaBan FROM khachhang WHERE id = ?", [id]);

  if(row.length > 0) {
    ma = row[0].MaBan;
  }

  return ma;
}

const DeleteGuest = async (id) => {
  let isCheck = false;
  const idTable = await getGuestTable(id);
  if(idTable != 0) {
    const [check] = await pool.execute("DELETE FROM `khachhang` WHERE `khachhang`.`id` = ?", [id]);
    if(check) {
      const [checkTable] = await updateTable(idTable, 0);
      if(checkTable) {
        isCheck = true;
      }
    }
  }

  return isCheck;
}

const AddBase = async (name) => {
  let data = {
    stats: 402,
    msg: "Thêm dữ liệu thất bại"
  }

  let [rows] = await pool.execute("INSER INTO coso(DiaChi) VALUES(?)", [name]);

  try {
    data.stats = 200
    data.msg= "Thêm dữ liệu thành công"
  } catch(err) {
    data.stats = 402
    data.msg= "Thêm dữ liệu thất bại"
  }

  return data;
}

const AddTableBase = async (num, id_base) => {
  let data = {
    stats: 402,
    msg: "Thêm dữ liệu thất bại"
  }

  let [rows] = await pool.execute("INSER INTO ban(SoNguoiToiDa, TinhTrang, MaCS) VALUES(?, 0, ?)", [num, id_base]);

  try {
    data.stats = 200
    data.msg= "Thêm dữ liệu thành công"
  } catch(err) {
    data.stats = 402
    data.msg= "Thêm dữ liệu thất bại"
  }

  return data;
}

module.exports = {
  AddTableBook,
  getListBase,
  getTablePending,
  tableListPay,
  deleteOrder,
  susses_table,
  payTable,
  AddBase,
  AddTableBase
};
