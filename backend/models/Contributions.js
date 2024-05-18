const mongoose = require('mongoose');

const contributions = new mongoose.Schema({
  contribution_id: { type: String, unique: true },
  user_id: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // 添加了 ref 字段来指定关联的模型
  },  // 引用 User 模型
  action: String,
  status: String,
  reviewed_by: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // 添加了 ref 字段来指定关联的模型
  },  // 引用 AdminList 模型
  date: String,
  data: {
    id:  String,
    name: String,
    subtitle: String,
    description: String,
    image_url: String,
    strength: Number,
    speed: Number,
    skill: Number,
    fear_factor: Number,
    power: Number,
    intelligence: Number,
    wealth: Number
  }
}, { versionKey: false });

const Contribution = mongoose.model('contribution', contributions);

module.exports = Contribution;