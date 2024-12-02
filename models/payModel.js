const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const pay = new Schema({
    id: { type: ObjectId },
    ngayGiaoDich : {type : Date},
    soTien: { type: Number},
    loaiGiaoDich: { type: String},
    idNguoiDung: { type: String}
});
module.exports = mongoose.models.pay || mongoose.model('pay', pay);