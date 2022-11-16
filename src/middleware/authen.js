require("dotenv").config();
const jwt = require("jsonwebtoken");
const {isEmptyObj} = require("../comom/functions");

const createToken = (data, expiresIn) => {
    let token = jwt.sign(data, process.env.KEY_SERSET_TOKEN, {expiresIn: expiresIn});

    return token;
}

const verifyTokenFuc = (token) => {
    let data = {};

    data = jwt.verify(token, process.env.KEY_SERSET_TOKEN)

    return data;
}


const verifyToken = (req, res, next) => {
    let authoriza = req.header("Authorization")
    let token = authoriza && authoriza.split(' ')[1];

    if(!token) {
        return res.status(403).json({
            msg: "Token không hợp lệ"
        })
    }

    try {
        let data = verifyTokenFuc(token);

        if(isEmptyObj(data)) {
            return res.status(403).json({
                msg: "Token không hợp lệ"
            })
        }

        next();
    }
    catch(err) {
        console.log(err)
    }

}

module.exports = {
    createToken,
    verifyToken,
    verifyTokenFuc
}