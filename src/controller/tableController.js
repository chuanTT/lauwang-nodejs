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

module.exports = {
  BookTable,
  ListBase,
};
