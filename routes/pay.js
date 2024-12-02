
var express = require("express");
var router = express.Router();

var payModel = require("../models/payModel");
const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");

// 1. Lấy toàn bộ danh sách sinh viên
router.get("/all", async function (req, res) {
    try {
      const token = req.header("Authorization").split(' ')[1];
      if (token) {
        JWT.verify(token, config.SECRETKEY, async function (err, id) {
          if (err) {
            res.status(403).json({ "status": false, message: "Có lỗi khi xảy ra" + err});
          } else {
   
            var list = await payModel.find({});
            res.status(200).json(list);
          }
        });
      } else {
      res.status(404).json({ status: false, message: "Không xác thực"});
      }
    } catch (error) {
      res.status(404).json({ status: false, message: "Có lỗi khi xảy ra" + error});
    }
  });
  



module.exports = router;
