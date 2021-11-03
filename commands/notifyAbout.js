const { SlashCommandBuilder } = require("@discordjs/builders");

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
    await interaction.deferReply();
    await interaction.editReply("Pong!");
  },
};
