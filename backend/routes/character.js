const express = require("express");
const router = express.Router();
const characterController= require("../controller/characterController");
router.post("/create", characterController.create);
router.delete("/:characterId/delete", characterController.delete);
router.post("/edit", characterController.edit);
router.get("/list", characterController.list);
module.exports = router;