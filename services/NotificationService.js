const PouchDB = require("pouchdb");
const crypto = require("crypto");

class NotificationService {
  async saveNotificationRule(rule) {
    let db = new PouchDB("notificationRules");
    await db.put({ _id: crypto.randomBytes(16).toString("hex"), ...rule });
  }
}

module.exports = NotificationService;
