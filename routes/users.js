var express = require('express');
var router = express.Router();

var userModel = require("../models/userModel");
const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");


//lay toan bo danh sach user
router.get("/all", async function(req, res) {
  var list = await userModel.find({},"fullname username"); //lay tat ca
  res.json(list);
});


// dang nhap
router.post("/login", async function (req, res) {
  try {
    const {username, password} = req.body;
    const checkUser = await userModel.findOne({username: username, password: password});
    if(checkUser == null){
      res.status(200).json({status: false, message:"username và mật khẩu không đúng"});
    }else{
      const token = JWT.sign({username: username},config.SECRETKEY,{expiresIn: '1d'});
      const refreshToken = JWT.sign({username: username},config.SECRETKEY,{expiresIn: '1d'});
      res.status(200).json({status: true, message:"Đăng nhập thành công", token: token, refreshToken: refreshToken});
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "Có lỗi xảy ra " + error });
  }
});



module.exports = router;
