var express = require("express");
var router = express.Router();

var studentModel = require("../models/studentModel");
const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");


// 1. Lấy toàn bộ danh sách sinh viên
router.get("/all_student", async function (req, res) {
    try {
      const token = req.header("Authorization").split(' ')[1];
      if (token) {
        JWT.verify(token, config.SECRETKEY, async function (err, id) {
          if (err) {
            res.status(403).json({ "status": false, message: "Có lỗi khi xảy ra" + err});
          } else {
   
            var list = await studentModel.find({});
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
  

// 2. Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
router.get("/cntt", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ status: false, message: "Có lỗi xảy ra: " + err });
                } else {
                  
                    const sinhVienCNTT = await studentModel.find({ boMon: "bmMobie" }); 
                    res.status(200).json(sinhVienCNTT);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        console.error("Error fetching CNTT students:", error);
        res.status(500).json({ status: false, message: "Có lỗi khi xảy ra: " + error });
    }
});



// 3. Lấy danh sách sinh viên có điểm trung bình từ 6.5 đến 8.5
router.get("/dtb", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const min = 6.5; 
                    const max = 8.5;
                    const list = await studentModel.find({ diemTB: { $gte: min, $lte: max } });
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




// 4. Tìm kiếm thông tin của sinh viên theo MSSV
router.get("/tim", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const MSSV = "PS457"; 
                    const sinhVien = await studentModel.findOne({ mssv: MSSV });
                    if (!sinhVien) {
                        return res.status(404).json({ message: `Không tìm thấy sinh viên với MSSV: ${MSSV}` });
                    }
                    res.json(sinhVien);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});


// 5. Thêm mới một sinh viên
router.post("/them", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const newItem = {
                        mssv: "12345678",    
                        nameStudent: "Nguyen Van c",
                        diemTB: 10,       
                        boMon: "bmMobie",  
                        tuoi: 16            
                    };
                    await studentModel.create(newItem);
                    res.status(200).json({ status: true, message: "Đã thêm thành công" });
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});



// 6. Thay đổi thông tin sinh viên theo MSSV
router.put("/thaydoi", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const MSSV = "123456"; 
                    const updateData = {
                        nameStudent: "Nguyen Van B", 
                        diemTB: 8.0                 
                    };

                    const updatedStudent = await studentModel.findOneAndUpdate(
                        { mssv: MSSV },
                        { $set: updateData },
                        { new: true }
                    );

                    if (!updatedStudent) {
                        return res.status(404).json({ message: "Sinh viên không tìm thấy." });
                    }

                    res.json(updatedStudent);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});

// 7. Xóa một sinh viên ra khỏi danh sách
router.delete("/xoa", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const MSSV = "123456";
                    const deletedStudent = await studentModel.findOneAndDelete({ mssv: MSSV });
                    if (!deletedStudent) {
                        return res.status(404).json({ message: "Sinh viên không tìm thấy." });
                    }
                    res.json({ message: "Đã xóa sinh viên thành công.", deletedStudent });
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});
// 8. Lấy danh sách các sinh viên thuộc BM CNTT và có DTB từ 9.0
router.get("/cntt/dtb/9", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const students = await studentModel.find({
                        boMon: "bmMobie",
                        diemTB: { $gte: 9.0 }
                    });
                    if (students.length === 0) {
                        return res.status(404).json({ message: "Không có sinh viên nào thỏa mãn điều kiện." });
                    }
                    res.json(students);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});


// 9. Lấy danh sách sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT có điểm trung bình từ 6.5
router.get("/cntt/age-range", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const students = await studentModel.find({
                        boMon: "bmMobie",
                        tuoi: { $gte: 18, $lte: 20 },
                        diemTB: { $gte: 6.5 }
                    });
                    if (students.length === 0) {
                        return res.status(404).json({ message: "Không có sinh viên nào thỏa mãn điều kiện." });
                    }
                    res.json(students);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});
// 10. Sắp xếp danh sách sinh viên tăng dần theo DTB
router.get("/tang", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const students = await studentModel.find().sort({ diemTB: 1 });
                    if (students.length === 0) {
                        return res.status(404).json({ message: "Danh sách sinh viên trống." });
                    }
                    res.json(students);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});

// 11. Tìm sinh viên có điểm trung bình cao nhất thuộc bộ môn CNTT
router.get("/top", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err) {
                if (err) {
                    res.status(403).json({ "status": false, message: "Có lỗi xảy ra: " + err });
                } else {
                    const topStudent = await studentModel
                        .findOne({ boMon: "bmMobie" })
                        .sort({ diemTB: -1 });
                    if (!topStudent) {
                        return res.status(404).json({ message: "Không có sinh viên nào thuộc bộ môn CNTT." });
                    }
                    res.json(topStudent);
                }
            });
        } else {
            res.status(404).json({ status: false, message: "Không xác thực" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Có lỗi xảy ra: " + error });
    }
});

// 11.  Tìm sinh viên có điểm trung bình cao nhất thuộc bộ môn CNTT
    router.get("/top", async function (req, res) {
        try {
            const topStudent = await studentModel
                .findOne({ boMon: "bmMobie" }) 
                .sort({ diemTB: -1 });         

            if (!topStudent) {
                return res.status(404).json({ message: "Không có sinh viên nào thuộc bộ môn CNTT." });
            }

            res.json(topStudent);
        } catch (error) {
            console.error("Error fetching top student:", error);
            res.status(500).json({ message: "Lỗi khi lấy thông tin sinh viên", error });
        }
    });



  module.exports = router;