const { getBaseUrl } = require("../comom/functions");
const menuModel = require("../model/menuModel");

const ListMenu = async (req, res) => {
    let baseUrl = getBaseUrl(req);
    let BaseUpload = `${baseUrl}/upload/menu/`;

    let {limit, per_pages} = req.params;

    limit=parseInt(limit);
    per_pages=parseInt(per_pages);

    const data = await menuModel.getListMenu(BaseUpload, limit, per_pages);

    return res.status(200).json(data);
}

module.exports = {
    ListMenu
};