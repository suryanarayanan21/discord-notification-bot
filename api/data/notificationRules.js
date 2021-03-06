const NotificationService = require("../../services/NotificationService");

module.exports = {
  handler(router, args) {
    router.get(async (req, res) => {
      try {
        let notificationRules =
          await new NotificationService().getNotificationRules();
        res.status(200).send(notificationRules);
      } catch (error) {
        res.status(500).send(error);
      }
    });
  },
};
