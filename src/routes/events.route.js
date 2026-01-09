const express = require("express");
const router = express.Router();
const { EventController } = require("../controllers");
const { authenticateToken } = require("../middleware/auth");

router
  .route("/")
  .post(authenticateToken, EventController.createEvents)
  .get(authenticateToken, EventController.listEvents);

router.route("/:id").delete(authenticateToken, EventController.deleteEvent);

module.exports = router;
