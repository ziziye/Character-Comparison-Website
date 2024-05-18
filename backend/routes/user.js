const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
//注册
router.post("/register", userController.register);
//登录
router.post("/login", userController.login);
//查询
router.get("/list", userController.list);
//
router.post("/:userId/promote", userController.promote)

router.post("/:userId/demote", userController.demote)

router.get("/:userId/getFavorite", userController.getFavorites)

router.post("/addFavorite", userController.addFavorite)

router.delete("/deleteFavorite",userController.deleteFavorite)

router.get('/getById/:userId', userController.getUserById);
module.exports = router;


