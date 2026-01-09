const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers");
const { authenticateToken } = require("../middleware/auth");

router.route("/").get(authenticateToken, UserController.getUser);

module.exports = router;
