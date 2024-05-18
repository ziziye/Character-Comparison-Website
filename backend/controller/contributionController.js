const connectDatabase = require("../utils/mongodb_connection");
const Contribution = require("../models/Contributions");
const mongoose = require("mongoose");
const Character = require("../models/Characters");
const UserModel= require("../models/User")
connectDatabase();

exports.list = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const contributions = await Contribution.find()
      .skip(skip)
      .limit(limit);

    const total = await Contribution.countDocuments();

    const dataWithAuthors = await Promise.all(contributions.map(async contribution => {
      let creatorName = "Unknown";
      let reviewerName = null;

      if (contribution.user_id && contribution.user_id._id) {
        const creatorUser = await UserModel.findById(contribution.user_id._id);
        if (creatorUser) {
          creatorName = `${creatorUser.firstname} ${creatorUser.lastname}`;
        }
      }

      if (contribution.reviewed_by && contribution.reviewed_by._id) {
        const reviewerUser = await UserModel.findById(contribution.reviewed_by._id);
        if (reviewerUser) {
          reviewerName = `${reviewerUser.firstname} ${reviewerUser.lastname}`;
        }
      }

      return {
        ...contribution.toObject(),
        creator: creatorName,
        reviewer: reviewerName
      };
    }));

    res.status(200).json({
      code: 200,
      msg: "Enquiry Successful",
      page,
      limit,
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

exports.findByCharacterId= async (req, res) => {
  const characterId = req.params.characterId; 

  try {
    const contributions = await Contribution.find({ "data.id": characterId })
      .sort({ date: -1 }); 

    const dataWithAuthors = await Promise.all(contributions.map(async (contribution) => {
      let creatorName = "Unknown";
      let reviewerName = null;

      if (contribution.user_id && contribution.user_id._id) {
        const creatorUser = await UserModel.findById(contribution.user_id._id);
        if (creatorUser) {
          creatorName = `${creatorUser.firstname} ${creatorUser.lastname}`;
        }
      }

      if (contribution.reviewed_by && contribution.reviewed_by._id) {
        const reviewerUser = await UserModel.findById(contribution.reviewed_by._id);
        if (reviewerUser) {
          reviewerName = `${reviewerUser.firstname} ${reviewerUser.lastname}`;
        }
      }

      return {
        ...contribution.toObject(), 
        creator: creatorName,
        reviewer: reviewerName
      };
    }));

    res.status(200).json({
      code: 200,
      msg: "Enquiry Successful",
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
exports.approve = async (req, res) => {
  const { contributionId } = req.params;

  try {
    const targetContribution = await Contribution.findOne({contribution_id: contributionId});
    if (!targetContribution) {
      return res.status(401).json({
        code: 401,
        msg: "This contribution was not found",
      });
    }
    if (targetContribution.status!=="Pending") {
        return res.status(402).json({
          code: 402,
          msg: "The operation failed, the contribution has already been processed.",
        });
  }
    const characterData = targetContribution.data;
    if (targetContribution.action === "AddCharacter") {
      let newCharacter = new Character(characterData);
      await newCharacter.save();
      targetContribution.status = 'Approved';
      targetContribution.reviewed_by= {_id:new mongoose.Types.ObjectId(req.session.userId)};
      await targetContribution.save();
      return res.status(200).json({
        code: 200,
        newCharacter,
        msg: "Contribution passed and the character was created successfully!",
      });
    } else if (targetContribution.action === "EditCharacter") {
      const updatedCharacter = await Character.findOneAndUpdate(
        {id: characterData.id},
        characterData,
        {
          new: true, 
          runValidators: true, 
        }
      );
      if (!updatedCharacter) {
        return res.status(404).json({
          code: 404,
          msg: "The character was not found.",
        });
      } 
      targetContribution.status = 'Approved';
      targetContribution.reviewed_by= {_id:new mongoose.Types.ObjectId(req.session.userId)};
      await targetContribution.save();
      return res.status(201).json({
        code: 201,
        updatedCharacter,
        msg: "Contribution passed, character modification successful!",
      });
     
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "Server not responding"+error.toString(),
    });
  }
};



exports.reject = async (req, res) => {
  const { contributionId } = req.params;
  try {
    const targetContribution = await Contribution.findOne({contribution_id: contributionId});
    if (!targetContribution) {
      return res.status(401).json({
        code: 401,
        msg: "This contribution was not found",
      });
    }
    if (targetContribution.status!=="Pending") {
        return res.status(402).json({
          code: 402,
          msg: "The operation failed, the contribution has already been processed.",
        });
  }
  targetContribution.status = 'Rejected';
  targetContribution.reviewed_by= {_id:new mongoose.Types.ObjectId(req.session.userId)};
  await targetContribution.save();
  return res.status(200).json({
    code: 200,
    targetContribution,
    msg: "Contribution successfully rejected",
  });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "Server not responding"+error,
    });
  }
};


exports.listContributionsByUserId = async (req, res) => {
  const { userId } = req.params; 
  try {
 
    const contributions = await Contribution.find({
      'user_id._id': new mongoose.Types.ObjectId(userId )
    });

    if (!contributions || contributions.length === 0) {
      return res.status(404).json({
        code: 404,
        msg: "Contribution not found matching this user ID",
      });
    }

 
    res.status(200).json({
      code: 200,
      data: contributions,
      msg: "Enquiry Successful",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "server error：" + error,
    });
  }
};
