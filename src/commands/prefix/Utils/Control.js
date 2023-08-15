const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "control",
  aliases: ["setcontrol"],
  usage: "<input>",
  category: "Utils",
  description: "Change the player mode for the bot",
  accessableby: "Members",

  run: async (client, message, args, language, prefix) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
      return message.channel.send(
        `${client.i18n.get(language, "utilities", "control_perm")}`,
      );

    const db = await client.db.get(`control.guild_${message.guild.id}`);
    const embed = new EmbedBuilder()
      .setDescription(
        `${client.i18n.get(language, "utilities", "control_set", {
          toggle:
            db == "enable"
              ? `${client.i18n.get(language, "music", "disabled")}`
              : `${client.i18n.get(language, "music", "enabled")}`,
        })}`,
      )
      .setColor(client.color);

    message.channel.send({ embeds: [embed] });
    return client.db.set(
      `control.guild_${message.guild.id}`,
      db.enable == "enable" ? "disable" : "enable",
    );
  },
};
