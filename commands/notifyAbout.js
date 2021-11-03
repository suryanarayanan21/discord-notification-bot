const { SlashCommandBuilder } = require("@discordjs/builders");
const NotificationService = require("../services/NotificationService.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notify-about")
    .setDescription("Let's me know what you care about something")
    .addStringOption((option) =>
      option
        .setName("notify-when")
        .setDescription(
          "String describing *when* you would like to be notified"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("search-string")
        .setDescription("Search string used to look for news online")
        .setRequired(true)
    ),
  async execute(interaction) {
    let notificationQuery = interaction.options.getString("notify-when");
    let sourceSearchString = interaction.options.getString("search-string");
    let channelId = interaction.channelId;

    await interaction.deferReply();
    await new NotificationService().saveNotificationRule({
      notificationQuery,
      sourceSearchString,
      channelId,
    });
    await interaction.editReply({
      content: "Notification Rules updated!",
      ephemeral: true,
    });
  },
};
