const PouchDB = require("pouchdb");

module.exports = {
  handler(router, args) {
    router.get(async (req, res) => {
      try {
        let db = new PouchDB("notificationRules");
        let docs = await db.allDocs({ include_docs: true });
        res.status(200).send(docs);
      } catch (error) {
        res.status(500).send(error);
      }
    });
  },
};
