const express = require("express");
const menuController = require("../controller/menuController");
const newsController = require("../controller/newsController");
const tableController = require("../controller/tableController");

const router = express.Router();

const ApiRouter = (app) => {
  // router menu
  router.get("/menu/list_menu/:limit/:per_pages", menuController.ListMenu);
  // end router menu

  // router news
  router.get("/news/list_news/:type/:limit/:per_pages", newsController.ListNews);

  router.get("/news/details_news/:id", newsController.DetailsNews);

  router.get("/news/search_news/:keyword/:limit/:per_pages", newsController.SearchNews);

  router.get("/news/search_tag_news/:tag/:limit/:per_pages", newsController.SearchTagNews);

  // end router news

  // router tables
  router.get("/table/list_base", tableController.ListBase);

  router.post("/table/book_table", tableController.BookTable);

  // and router tables

  return app.use("/api", router);
};

module.exports = ApiRouter;
