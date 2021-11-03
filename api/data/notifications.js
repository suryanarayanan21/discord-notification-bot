module.exports = {
  handler(router, args) {
    router.get((req, res) => {
      res.status(200).send({ client: JSON.stringify(args.client) });
    });
  },
};
