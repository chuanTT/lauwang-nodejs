const tableModel = require("../model/tableModel");

const BookTable = async (req, res) => {
  const result = {
    status: "401",
    msg: "Insert database error",
  };
  let { full_name, phone, date, time, department, adults, child, description } =
    req.body;

  if (full_name && phone && date && time && department && adults) {
    date = Date.parse(date);
    child = parseInt(child);
    adults = parseInt(adults);
    department = parseInt(department);

    const status = await tableModel.AddTableBook([
      full_name,
      phone,
      date,
      time,
      department,
      adults,
      child,
      description,
    ]);

    if(status) {
      result.status = 200
      result.msg = "Insert sussessfull"
    }
  }
  return res.status(200).json(result);
};

const ListBase = async (req, res) => {
  const data = await tableModel.getListBase();

  return res.status(200).json(data);
};

const ListTablePeding = async (req, res) => {
  let {limit, per_pages} = req.params;

  limit=parseInt(limit);
  per_pages=parseInt(per_pages);
  const data = await tableModel.getTablePending(limit, per_pages);

  if(data.data.length > 0) {
    return res.status(200).json(data);
  }

  return res.status(403);
}

const ListTablePay = async (req, res) => {
  let {type, id_base, limit, per_pages} = req.params;

  limit=parseInt(limit);
  per_pages=parseInt(per_pages);
  type=parseInt(type);
  id_base=parseInt(id_base);

  let data = await tableModel.tableListPay(id_base, type, limit, per_pages);

  if(data.data.length > 0) {
    return res.status(200).json(data)
  }

  return res.status(402).json({
    msg: "Không tìm thấy bản ghi nào"
  })
}

const cancelOrder = async (req, res) => {
  let {id} = req.params;

  if(!id) return;
  
  let isSussess = await tableModel.deleteOrder(id);
  let result = {
    status: 403,
    msg: "Hủy đặt bàn thất bại"
  }
  if(isSussess) {
    result.msg = "Hủy đặt bàn thành công";
    result.status = 200
  }
  return res.json(result)
}

const payTableGuest = async (req, res) => {
  let {id} = req.body;

  if(!id) return;
  
  let isSussess = await tableModel.payTable(id);
  let msg = "Hủy đặt bàn thất bạn";
  if(isSussess) {
    msg = "Hủy đặt bàn thành công";
  }
  return res.json({
    msg
  })
}

const sussesTable = async (req, res) => {
  const {id_temp, id_table} = req.body;

  if(!id_temp, !id_table){
    return res.status(200).json({
      status: 402,
      msg: "Duyệt bàn không thành công"
    })
  }

  let isSussess = await tableModel.susses_table(id_temp, id_table);

  return isSussess;
}

const AddBaseName = async (req, res) => {
  let {name} = req.body;

  if(!name) return;

  let data = await tableModel.AddBase(name);

  return res.status(200).json(data);
}

const AddTable = async (req, res) => {
  let {num, id_base} = req.body;

  if(!num && !id_base) {
    return res.status(200).json({
      msg: "Thêm bàn thất bại",
      status: 403
    })
  }

  let isSussess = await tableModel.AddTableBase(num, id_base);

  return res.status(200).json(isSussess);
}


module.exports = {
  BookTable,
  ListBase,
  ListTablePeding,
  ListTablePay,
  cancelOrder,
  payTableGuest,
  sussesTable,
  AddBaseName,
  AddTable
};
