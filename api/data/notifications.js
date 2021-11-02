module.exports = {
  handler(router) {
    router.get((req, res) => {
      res.status(200).send({ message: "done" });
    });
  },
};
