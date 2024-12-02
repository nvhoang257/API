
var express = require("express");
var router = express.Router();

var payModel = require("../models/payModel");
const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");

// 1. Lấy toàn bộ danh sách nạp
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

// 2. Lấy toàn bộ danh sách giao dịch có loaiGiaoDich là "Chuyển khoản"
router.get("/chuyenkhoan", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ status: false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const giaoDichChuyenKhoan = await payModel.find({ loaiGiaoDich: "Chuyển khoản" });
                    res.status(200).json(giaoDichChuyenKhoan);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        console.error("Error fetching Chuyển khoản transactions:", error);
        res.status(500).json({ status: false, message: "Có lỗi khi xảy ra: " + error });
    }
});

// 3. Lấy toàn bộ danh sách giao dịch có loaiGiaoDich là "Chuyển khoản"
router.get("/chuyenkhoan", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ status: false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const giaoDichChuyenKhoan = await payModel.find({ loaiGiaoDich: "Chuyển khoản" });
                    res.status(200).json(giaoDichChuyenKhoan);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        console.error("Error fetching Chuyển khoản transactions:", error);
        res.status(500).json({ status: false, message: "Có lỗi khi xảy ra: " + error });
    }
});

// 4. Lấy danh sách giao dịch có soTien từ 500 đến 1500
router.get("/sotien", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const min = 500; 
                    const max = 1500;
                    const list = await payModel.find({ soTien: { $gte: min, $lte: max } });
                    res.status(200).json(list);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});

// 5. Tìm kiếm thông tin giao dịch theo idNguoiDung
router.get("/tim", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const idNguoiDung = "A007";
                    const giaoDich = await payModel.findOne({ idNguoiDung: idNguoiDung });
                    if (!giaoDich) {
                        return res.status(404).json({ message: `Không tìm thấy giao dịch với idNguoiDung: ${idNguoiDung}` });
                    }
                    res.json(giaoDich);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});

// 6. Thêm mới một giao dịch
router.post("/them", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const newTransaction = {
                        ngayGiaoDich: new Date("2024-12-18"),  
                        soTien: 4000,                          
                        loaiGiaoDich: "Tiền mặt",              
                        idNguoiDung: "A009"                    
                    };
                    await payModel.create(newTransaction);
                    res.status(200).json({ status: true, message: "Đã thêm giao dịch thành công" });
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});

// 7. Cập nhật thông tin giao dịch theo _id (set cứng giá trị)
router.put("/capnhat/:id", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const { id } = req.params; 

                    const newTransactionData = {
                        ngayGiaoDich: new Date("2024-12-19"),  
                        soTien: 5000,                          
                        loaiGiaoDich: "Chuyển khoản",              
                        idNguoiDung: "A010"                    
                    };

                    const updatedTransaction = await payModel.findByIdAndUpdate(
                        id,
                        newTransactionData,
                        { new: true }
                    );

                    if (!updatedTransaction) {
                        return res.status(404).json({ status: false, message: "Không tìm thấy giao dịch để cập nhật" });
                    }

                    res.status(200).json({ status: true, message: "Cập nhật giao dịch thành công", updatedTransaction });
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});


// 8. Xóa giao dịch theo _id (set cứng giá trị)
router.delete("/xoa/:id", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const { id } = req.params;

                    const deletedTransaction = await payModel.findByIdAndDelete(id);

                    if (!deletedTransaction) {
                        return res.status(404).json({ status: false, message: "Không tìm thấy giao dịch để xóa" });
                    }

                    res.status(200).json({ status: true, message: "Xóa giao dịch thành công" });
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});

// 10. Lọc giao dịch theo ngày giao dịch (set cứng ngày bắt đầu và kết thúc)
router.get("/timtheongay", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                   
                    const startDate = "2024-12-01";
                    const endDate = "2024-12-10";
                    
                    const transactions = await payModel.find({
                        ngayGiaoDich: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate),
                        },
                    });

                    res.status(200).json(transactions);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});

// 9. Lọc giao dịch theo loaiGiaoDich và khoảng số tiền (set cứng)
router.get("/timtheoloaivoiso", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                  
                    const loaiGiaoDich = "Chuyển khoản";
                    const minAmount = 500;
                    const maxAmount = 1500;

                    const transactions = await payModel.find({
                        loaiGiaoDich: loaiGiaoDich,
                        soTien: { $gte: minAmount, $lte: maxAmount },
                    });

                    res.status(200).json(transactions);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});


module.exports = router;
