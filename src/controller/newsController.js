const { getBaseUrl } = require("../comom/functions");
const newsModel = require("../model/newsModel");

const uploadFolder = "upload/news/";

const ListNews = async (req, res) => {
    let baseUrl = getBaseUrl(req);
    let BaseUpload = `${baseUrl}/${uploadFolder}`;

    let {type, limit, per_pages} = req.params;

    type=parseInt(type);
    limit=parseInt(limit);
    per_pages=parseInt(per_pages);

    const data = await newsModel.getListNews(BaseUpload,type, limit, per_pages);

    return res.status(200).json(data);
}

const DetailsNews = async (req, res) => {
    let baseUrl = getBaseUrl(req);
    let BaseUpload = `${baseUrl}/${uploadFolder}`;

    let {id} = req.params;

    id=parseInt(id);

    const data = await newsModel.getDetailsNews(BaseUpload, id);

    return res.status(200).json(data);
}

const SearchNews = async (req, res) => {
    let baseUrl = getBaseUrl(req);
    let BaseUpload = `${baseUrl}/${uploadFolder}`;

    let {keyword, limit, per_pages} = req.params;

    limit=parseInt(limit);
    per_pages=parseInt(per_pages);

    const data = await newsModel.getSearchNews(BaseUpload, keyword, limit, per_pages);

    return res.status(200).json(data);
}

const SearchTagNews = async (req, res) => {
    let baseUrl = getBaseUrl(req);
    let BaseUpload = `${baseUrl}/${uploadFolder}`;

    let {tag, limit, per_pages} = req.params;

    limit=parseInt(limit);
    per_pages=parseInt(per_pages);

    const data = await newsModel.getNewsByTag(BaseUpload, tag, limit, per_pages);

    return res.status(200).json(data);
}

module.exports = {
    ListNews,
    DetailsNews,
    SearchNews,
    SearchTagNews
};