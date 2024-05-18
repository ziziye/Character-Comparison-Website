const mongoose = require('mongoose');

const characters = new mongoose.Schema({
  id: { type: String, unique: true },
  active: { type: Boolean, default: true },
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
}, { versionKey: false });

const Character = mongoose.model('character', characters);

module.exports = Character;