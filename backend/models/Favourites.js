const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
  user_id: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, 
  },
  characters: [String],
}, { versionKey: false });

const Favorites = mongoose.model("favourites", favoritesSchema);

module.exports = Favorites;
