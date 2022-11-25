const useModel = require("../model/userModel");
const {
  bcryptCompare,
  isEmptyObj,
  removeProperty,
  getBaseUrl,
} = require("../comom/functions");
const {createToken, verifyTokenFuc} = require("../middleware/authen");

const uploadFolder = "upload/user/";

const Login = async (req, res) => {
  let { user_name, password } = req.body;
  let baseUrl = getBaseUrl(req);
  let BaseUpload = `${baseUrl}/${uploadFolder}`;

  if (!user_name && !password) {
    return res.status(200).json({
      msg: "Tài khoản hoặc mật khẩu không chính xác",
    });
  }


  let user = await useModel.login(user_name, BaseUpload);

  let isCheckUser = isEmptyObj(user);

  if (!isCheckUser) {
    let pwd = user.password;
    let isCheckPss = bcryptCompare(password, pwd);

    if (isCheckPss) {
      let userNews = removeProperty("password", user);
      let now = Date.now() + 24*60*60*1000;
      let token = createToken(userNews, now);

      return res.status(200).json({
        token: token,
        expiresIn: now,
      })
    }
  }

  return res.status(200).json({
    status: "402",
    msg: "Đăng nhập không thành công",
  });
};

const DataByToken = async (req, res) => {
  let baseUrl = getBaseUrl(req);
  let BaseUpload = `${baseUrl}/${uploadFolder}`;
  let authoriza = req.header("Authorization")
  let token = authoriza && authoriza.split(' ')[1];

  let data = verifyTokenFuc(token);

  if(data?.id) {
    let result = await useModel.getInforUser(data.id, BaseUpload);

    if(!isEmptyObj(result)) {
      return res.status(200).json({
        status: 200,
        msg: "Lấy dữ liệu thành công",
        data: result
      })
    }

  }

  return res.status(200).json({
    status: 403,
    msg: "Lấy dữ liệu thất bại"
  })
}

const GetListUser = async (req, res) => {
  let result = {
    status: 403,
    msg: "Get data erorr"
  }
  let baseUrl = getBaseUrl(req);
  let BaseUpload = `${baseUrl}/${uploadFolder}`;

  let {id, limit, perPages} = req.params;

  let data = await useModel.getListUser(id, limit, perPages, BaseUpload);

  if(data.data.length > 0) {
    result.status = 200
    result.msg = "Get data sussessfull"
    result.data = data
  }

  return res.status(200).json(result);
}

module.exports = {
  Login,
  DataByToken,
  GetListUser
};
