const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notify-about")
    .setDescription("Let's me know you care about something"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
