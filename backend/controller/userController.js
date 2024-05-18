const connectDatabase = require("../utils/mongodb_connection");
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;
const AdminList = require("../models/Adminlist");
const Favorites = require("../models/Favourites");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

connectDatabase();
exports.list = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find().skip(skip).limit(limit);
    const total = await User.countDocuments();

    const usersWithRole = await Promise.all(
      users.map(async (user) => {
        const isAdmin = await AdminList.exists({ _id: user._id });
        const role = isAdmin ? "Admin" : "User";
        
        return {
          ...user.toObject(), 
          role, 
        };
      })
    );

    res.status(200).json({
      code: 200,
      msg: "Enquiry Successful",
      page,
      limit,
      total,
      data: usersWithRole,
    });
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
};

exports.register = async (req, res) => {
  try {
    const newUser = new User(req.body);

    const hash = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = hash;
    const dbBack = await newUser.save();
    user = dbBack.toJSON();

    res.status(201).json({
      code: 201,
      msg: "Successful registration",
      user,
    });
  } catch (error) {
    res.status(501).json({
      code: 501,
      msg: "registration failure " + error,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email == null || password == null) {
    return res.status(400).json({
      code: 400,
      msg: "Login Failure, Login Email and Password can't be empty.",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(401).json({
        code: 401,
        msg: "Login failed, user not found",
      });
    }
 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(402).json({
        code: 402,
        msg: "Wrong password or account number",
      });
    } else {
      const isAdmin = await AdminList.exists({
        _id: new mongoose.Types.ObjectId(user._id),
      });

      req.session.userId = user._id.toString();
      req.session.username = user.firstname + " " + user.lastname;
      req.session.email = user.email;
      req.session.save();
      
      res.json({
        code: 200,
        msg: "Login Successful",
        userId: req.session.userId,
        isAdmin: isAdmin ? true : false,
        username: req.session.username,
        email: req.session.email,
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "Server not responding" + error.message,
    });
  }
};

exports.promote = async (req, res) => {
  const { userId } = req.params;
  try {
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        code: 404,
        msg: "The user cannot be traced",
      });
    }
    const isAdmin = await AdminList.findOne({ _id: userId });
    if (isAdmin) {
      return res.status(404).json({
        code: 405,
        msg: "The user is already an administrator",
      });
    }
    const newAdmin = new AdminList({ _id: userId });
    await newAdmin.save();
    res.status(200).json({
      code: 200,
      msg: "User promoted to administrator successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "Server not responding" + error.message,
    });
  }
};

exports.demote = async (req, res) => {
  const { userId } = req.params; 
  const loggedInUserId = req.session.userId; 

  if (userId === loggedInUserId) {
  
    return res.status(403).json({
      code: 403,
      msg: "Administrators cannot demote their own accounts",
    });
  }

  try {
    const isAdmin = await AdminList.findById(userId);
    if (!isAdmin) {
      return res.status(404).json({
        code: 404,
        msg: "The administrator was not found",
      });
    }


    await AdminList.findByIdAndRemove(userId);
    res.status(200).json({
      code: 200,
      msg: "Administrator demoted successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "Server Issues. " + error.message,
    });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userFavorites = await Favorites.findOne({
      "user_id._id": new ObjectId(req.params.userId),
    });

    if (!userFavorites) {
      console.log("Favorites not found");
      return res.status(404).json({
        code: 404,
        msg: "User not found or favourite",
      });
    }

    res.status(200).json({
      code: 200,
      msg: "Enquiry Successful",
      favorites: userFavorites.characters,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "Server error:" + error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: new ObjectId(req.params.userId)
    });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        code: 404,
        msg: "User not found",
      });
    }

    res.status(200).json({
      code: 200,
      msg: "Enquiry Successful",
      user: user
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "Server error:" + error.message,
    });
  }
};
exports.addFavorite = async (req, res) => {
  const { userId, characterId } = req.body;
  try {
    const favorite = await Favorites.findOne({
      "user_id._id": new ObjectId(userId),
    });
    if (favorite) {

      favorite.characters.push(characterId);
      await favorite.save();
    } else {

      const newFavorite = new Favorites({
        user_id: {
          _id: new ObjectId(userId),
          ref: "users", 
        },
        characters: [characterId],
      });
      await newFavorite.save();
    }
    res.status(201).json({
      code: 201,
      msg: "Favourites added successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "Server error:" + error.message,
    });
  }
};

exports.deleteFavorite = async (req, res) => {
  const { userId, characterId } = req.body;
  try {
    const favorite = await Favorites.findOne({
      "user_id._id": new ObjectId(userId),
    });
    if (favorite && favorite.characters.includes(characterId)) {
     
      favorite.characters = favorite.characters.filter(
        (id) => id !== characterId
      );
      await favorite.save();
      res.status(200).json({
        code: 200,
        msg: "Collection deleted successfully",
      });
    } else {
      
      res.status(404).json({
        code: 404,
        msg: "Collection not found or user has no collection",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "Server error:" + error.message,
    });
  }
};
