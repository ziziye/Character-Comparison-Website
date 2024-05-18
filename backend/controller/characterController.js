const connectDatabase = require("../utils/mongodb_connection");
const Contribution = require("../models/Contributions");
const Character = require("../models/Characters");
const mongoose = require("mongoose");
const User = require('../models/User');

const AdminList = require("../models/Adminlist");
const { v4: uuidv4 } = require('uuid');
connectDatabase();





exports.list = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  try {
    let characters;
    let total;

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      const skip = (page - 1) * limit;
      characters = await Character.find({ active: true }).skip(skip).limit(limit);
      total = await Character.countDocuments({ active: true });
    } else {
      characters = await Character.find({ active: true });
      total = characters.length;
    }

    const dataWithAuthors = await Promise.all(characters.map(async (character) => {
      const contributions = await mongoose.model('contribution').find({
        "data.id": character.id,
        "action": "AddCharacter",
        "status": "Approved"
      }).populate('user_id._id');

      if (contributions.length === 0) {
        return { ...character.toObject(), authorName: null, authorId: null };
      }

      const author = contributions[0].user_id._id;
      return {
        ...character.toObject(),
        authorName: author ? `${author.firstname} ${author.lastname}` : "Unknown",
        authorId: author ? author._id : null
      };
    }));

    res.status(200).json({
      code: 200,
      msg: "Enquiry Successful",
      total,
      data: dataWithAuthors
    });
  } catch (error) {
    console.error("Error during data fetch:", error);
    res.status(500).json({
      code: 500,
      msg: "Server issues " + error,
    });
  }
};

exports.create = async (req, res) => {
  const characterData = req.body;
  const userId = req.session.userId;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const isAdmin = await AdminList.exists({
      _id: new mongoose.Types.ObjectId(userId),
    });
    
    const existingCharacter = await Character.findOne({ id: characterData.id });
    if (existingCharacter) {
      return res.status(404).json({
        code: 404,
        msg: "Failed to create role, role already exists",
      });
    }

    const existingContribution = await Contribution.findOne({
      action: "AddCharacter",
      status: "Pending",
      "data.id": characterData.id,
    });
    if (existingContribution) {
      return res.status(409).json({
        code: 409,
        msg: "There is a pending role creation request, please wait for administrator approval",
      });
    }

    const newContribution = new Contribution({
      contribution_id: uuidv4(),
      user_id: {_id:new mongoose.Types.ObjectId(req.session.userId)}, 
      action: "AddCharacter",
      status: isAdmin ? "Approved" : "Pending", 
      reviewed_by: isAdmin ? {_id:new mongoose.Types.ObjectId(req.session.userId)} : null, 
      date: new Date().toISOString(), 
      data: {
        id: characterData.id,
        name: characterData.name,
        subtitle: characterData.subtitle,
        description: characterData.description,
        image_url: characterData.image_url,
        strength: characterData.strength,
        speed: characterData.speed,
        skill: characterData.skill,
        fear_factor: characterData.fear_factor,
        power: characterData.power,
        intelligence: characterData.intelligence,
        wealth: characterData.wealth,
      },
    });

    await newContribution.save({ session: session });
    // const dbBack = await newContribution.save();
    // contribution = dbBack.toJSON();

    if (isAdmin) {
      const newCharacter = new Character(characterData);
      await newCharacter.save({ session: session });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      code: 201,
      msg: isAdmin ? "Character created and automatically approved successfully" : "Created successfully, waiting for approval",
      creator: req.session.username,
      newContribution,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      code: 500,
      msg: "Server issues " + error,
    });
  }
};

exports.delete = async (req, res) => {
  const characterId = req.params.characterId;
  const userId = req.session.userId;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const isAdmin = await AdminList.exists({
      _id: new mongoose.Types.ObjectId(userId),
    });

    if (!isAdmin) {
      return res.status(400).json({
        code: 400,
        msg: "The operation failed, only the administrator can perform the delete operation",
      });
    } else {
      const newContribution = new Contribution({
        contribution_id: uuidv4(),
        user_id: {_id:new mongoose.Types.ObjectId(userId)}, 
        action: "DeleteCharacter",
        status: "Approved", 
        reviewedBy: {_id:new mongoose.Types.ObjectId(userId)}, 
        date: new Date().toISOString(), 
        data: {
          id: characterId,
        },
      });
      await newContribution.save({ session: session });
      // const dbBack = await newContribution.save();
      // contribution = dbBack.toJSON();
    }

    const targetCharacter = await Character.findOne({ id: characterId });
    if (targetCharacter) {
        if(targetCharacter.active === false){
          return res.status(400).json({
            code: 400,
            msg: "Deletion failed, the role is already deleted",
            targetCharacter,
          });
        }
      targetCharacter.active = false;   
      await targetCharacter.save();
    
      await session.commitTransaction();
      session.endSession(); 
    
      return res.status(200).json({
        code: 200,
        msg: "Character deleted successfully",
        targetCharacter,
      });
    } else {
      return res.status(400).json({
        code: 400,
        msg: "Deletion failed, the role was not found",
        targetCharacter
      });
    }
  
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      code: 500,
      msg: "Server issues happen" + error,
    });
  }
};


exports.edit = async (req, res) => {
  const characterData = req.body;
  const userId = req.session.userId;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const isAdmin = await AdminList.exists({
      _id: new mongoose.Types.ObjectId(userId),
    });

    const existingCharacter = await Character.findOne({ id: characterData.id });
    if (!existingCharacter) {
      return res.status(404).json({
        code: 404,
        msg: "The specified role ID does not exist",
      });
    }

    const existingContribution = await Contribution.findOne({
      action: "EditCharacter",
      status: "Pending",
      "data.id": characterData.id,
    });
    if (existingContribution) {
      return res.status(409).json({
        code: 409,
        msg: "There is a pending role edit request, please wait for administrator approval",
      });
    }

    const newContribution = new Contribution({
      contribution_id: uuidv4(),
      user_id: {_id:new mongoose.Types.ObjectId(req.session.userId)},
      action: "EditCharacter",
      status: isAdmin ? "Approved" : "Pending",
      reviewed_by: isAdmin ? {_id:new mongoose.Types.ObjectId(req.session.userId)} : null,
      date: new Date().toISOString(),
      data: {
        id: characterData.id,
        name: characterData.name,
        subtitle: characterData.subtitle,
        description: characterData.description,
        image_url: characterData.image_url,
        strength: characterData.strength,
        speed: characterData.speed,
        skill: characterData.skill,
        fear_factor: characterData.fear_factor,
        power: characterData.power,
        intelligence: characterData.intelligence,
        wealth: characterData.wealth,
      },
    });

    await newContribution.save({ session: session });

    if (isAdmin) {
      await Character.updateOne({ id: characterData.id }, characterData, { session: session });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      code: 201,
      msg: isAdmin ? "Role edited and automatically approved successfully" : "Edit request submitted, awaiting approval",
      editor: req.session.username,
      newContribution,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      code: 500,
      msg: "Server issues " + error,
    });
  }
};
