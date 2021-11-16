const PouchDB = require("pouchdb");
const crypto = require("crypto");
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} = require("firebase/firestore");

class NotificationService {
  async saveNotificationRule(rule) {
    const db = getFirestore();
    await addDoc(collection(db, "NotificationRules"), rule);
  }

  async getNotificationRules() {
    const db = getFirestore();
    const rules = await getDocs(collection(db, "NotificationRules"));
    let ret = [];
    rules.forEach((doc) => {
      ret.push(doc.data());
    });
    return ret;
  }
}

module.exports = NotificationService;
