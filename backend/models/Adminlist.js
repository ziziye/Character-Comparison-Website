const mongoose = require('mongoose');

const adminList = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
}, { versionKey: false });

const AdminList = mongoose.model('adminlist', adminList);

module.exports = AdminList;