const express = require("express");
const cors = require("cors");
const ApiRouter = require("./router/routerApi");

// setUp dotenv
require("dotenv").config();


const app = express();
const port = process.env.PORT || 3001;

// allow 
app.use(express.static('./src/public'));

// 
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// fix cors policy
app.use(cors({origin: '*'}));

// config router
ApiRouter(app);

app.listen(port, () => {
  console.log("Server runing....");
});
