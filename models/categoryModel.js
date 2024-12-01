const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const category = new Schema({
    name : {type : String}
});
module.exports = mongoose.models.category || mongoose.model('category', category);

