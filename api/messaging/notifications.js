module.exports = {
  handler(router, args) {
    router.post(async (req, res) => {
      let { client } = args;
      let { channelId, messageBody } = req.body;
      let channel = client.channels.cache.get(channelId);
      try {
        await channel.send(messageBody);
        res.status(200).send({ message: "Message Delivered" });
      } catch (error) {
        res.status(500).send({ message: "Message Delivery Failed" });
      }
    });
  },
};
