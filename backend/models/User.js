const mongoose = require('mongoose');
const User=new mongoose.Schema({
    // _id: {type:mongoose.Schema.Types.ObjectId, required: [true,]},
    // _id:mongoose.Schema.Types.ObjectId,
    firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    password: String
}, { versionKey: false });

const UserModel = mongoose.model('users', User);
module.exports = UserModel;