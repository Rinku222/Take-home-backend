const { EventService } = require("../services/index.js");
const { eventsValidator } = require("../validator/index.js");
const { CommonFun } = require("../utils/index.js");

module.exports = {
  createEvents: async (req, res, next) => {
    try {
      let body = await CommonFun.removeNullValFromObj(req.body);
      const { value, error } = await eventsValidator.event(body);
      if (error) {
        console.log("error", error);
        return res.status(400).json({
          result: {
            status: false,
            message: error.details
              ? error.details[0].message
              : error.message || "Validation error",
          },
        });
      }
      const userId = req.user.id;
      const result = await EventService.createEvent(body, userId);
      return res.json({ result });
    } catch (err) {
      next(err);
    }
  },
  listEvents: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await EventService.listEvents(userId);
      return res.json({ result });
    } catch (err) {
      next(err);
    }
  },

  deleteEvent: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await EventService.deleteEvent(req.params.id, userId);
      return res.json({ result });
    } catch (err) {
      next(err);
    }
  },
};
