const NotificationService = require("../../services/NotificationService");

module.exports = {
  handler(router, args) {
    router.post(async (req, res) => {
      try {
        await new NotificationService().saveNotificationRule(req.body);
        res.status(200).send({ status: "Success" });
      } catch (error) {
        res.status(500).send(error);
      }
    });
  },
};
