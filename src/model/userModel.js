// connect database
const pool = require("../config/configDB");

const getFullName = async (id) => {
    let FullName = "";

    const [rows] = await pool.execute("SELECT HoTen as name FROM nhanvien WHERE id = ?", [id]);

    if(rows) {
        FullName = rows[0].name;
    }

    return FullName;
}

module.exports = {
    getFullName
}