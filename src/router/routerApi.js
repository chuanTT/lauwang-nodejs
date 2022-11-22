const express = require("express");
const menuController = require("../controller/menuController");
const newsController = require("../controller/newsController");
const tableController = require("../controller/tableController");
const userController = require("../controller/userController");
const { verifyToken } = require("../middleware/authen");
const { uploadMenu } = require("../middleware/uploadFile");

const router = express.Router();


const ApiRouter = (app) => {

  // router menu
  router.get("/menu/list_menu/:limit/:per_pages", menuController.ListMenu);
  router.post("/menu/add_menu", verifyToken, uploadMenu.single('thumbnail'), menuController.AddMenu)
  router.delete("/menu/delete_menu/:id",verifyToken,menuController.deleteMenu);
  router.post("/menu/edit_menu",verifyToken,uploadMenu.single('thumbnail'),menuController.deleteMenu);
  // end router menu

  // router news
  router.get("/news/list_news/:type/:limit/:per_pages", newsController.ListNews);
  router.get("/news/details_news/:id", newsController.DetailsNews);
  router.get("/news/search_news/:keyword/:limit/:per_pages", newsController.SearchNews);
  router.get("/news/search_tag_news/:tag/:limit/:per_pages", newsController.SearchTagNews);

  router.get("/news/delete_news/:id",verifyToken,newsController.deleteNews);
  // end router news

  // router tables
  router.get("/table/list_base", tableController.ListBase);
  router.post("/table/book_table", tableController.BookTable);
  // end router tables

  // router authen
  router.post("/user/login", userController.Login);
  router.post("/user/get_data", verifyToken, userController.DataByToken);
  // end router authe 

  // router table private
  router.get("/table/list_table_peding/:limit/:per_pages", verifyToken, tableController.ListTablePeding)
  router.get("/table/list_table_pay/:id_base/:type/:limit/:per_pages", verifyToken, tableController.ListTablePay)
  router.delete("/table/cancel_order/:id", verifyToken, tableController.cancelOrder);
  router.get("/table/pay_table/:id", verifyToken, tableController.payTableGuest);
  router.get("/table/susses_table/:id_temp/:id_table", verifyToken, tableController.sussesTable);
  router.post("/table/add_base", verifyToken, tableController.AddBaseName);
  router.post("/table/add_table", verifyToken, tableController.AddTable);
  // end router table private


  return app.use("/api", router);
};

module.exports = ApiRouter;
