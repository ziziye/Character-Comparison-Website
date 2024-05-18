const express = require("express");
const router = express.Router();
const contributionController= require("../controller/contributionController");
router.get("/list", contributionController.list);
router.post("/:contributionId/approve", contributionController.approve);
router.post("/:contributionId/reject", contributionController.reject);
router.get("/:userId/findByUserId", contributionController.listContributionsByUserId);
router.get("/:characterId/findByCharacterId", contributionController.findByCharacterId);
module.exports = router;
