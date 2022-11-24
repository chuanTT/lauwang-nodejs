const { isEmptyObj } = require("../comom/functions");
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
  let result = {
    status: 403,
    msg: "Get data erorr"
  }

  limit=parseInt(limit);
  per_pages=parseInt(per_pages);
  const data = await tableModel.getTablePending(limit, per_pages);

  if(data.data.length > 0) {
    result.status = 200
    result.msg = "Get data sussessfull"
    result.data = data
  }

  return res.status(200).json(result);
}

const ListTablePay = async (req, res) => {
  let result = {
    status: 200,
    msg: "Get data error"
  }

  let {type, id_base, limit, per_pages} = req.params;

  limit=parseInt(limit);
  per_pages=parseInt(per_pages);
  type=parseInt(type);
  id_base=parseInt(id_base);

  let data = await tableModel.tableListPay(id_base, type, limit, per_pages);

  if(data.data.length > 0) {
    result.status = 200
    result.msg = "Get data sussesfull"
    result.data = data;
  }

  return res.status(200).json(result)
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
  let {id} = req.params;
  let result = {
    status: 402,
    msg: "Trả bàn không thành công"
  }

  if(!id) return res.status(200).json(result);
  
  let isSussess = await tableModel.payTable(id);

  if(isSussess) {
    result.msg = "Trả bàn thành công";
    result.status = 200
  }
  return res.status(200).json(result)
}

const sussesTable = async (req, res) => {
  const {id_temp, id_table} = req.body;

  if(!id_temp && !id_table){
    return res.status(200).json({
      status: 402,
      msg: "Duyệt bàn không thành công"
    })
  }

  let isSussess = await tableModel.susses_table(id_temp, id_table);
  return res.status(200).json(isSussess);
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

const ListOnePending = async (req, res) => {
  const {id} = req.params;
  const result = {
    status: 200,
    msg: "Get data error"
  }
  
  if(!id) return res.status(200).json(result)

  const data = await tableModel.getListOnePending(id);

  if(!isEmptyObj(data)) {
    result.status = 200
    result.msg = "Get data sussesfull"
    result.data = data
  }

  return res.status(200).json(result);
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
  AddTable,
  ListOnePending
};
