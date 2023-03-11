const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const GControl = require('../../../plugins/schemas/control.js');

module.exports = {
    name: "control",
    aliases: ["setcontrol"],
    usage: "<input>",
    category: "Utils",
    description: "Change the player mode for the bot",
    accessableby: "Members",
    
    run: async (client, message, args, language, prefix) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.channel.send(`${client.i18n.get(language, "utilities", "control_perm")}`);

        const db = await GControl.findOne({ guild: message.guild.id });
        if (db.enable) {
            db.enable = false;
            db.save();

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "utilities", "control_set", {
                    toggle: "Disabled"
                })}`)
                .setColor(client.color)

            message.channel.send({ embeds: [embed] });

        } else {
            db.enable = true;
            db.save();

            const embed = new EmbedBuilder()
                .setDescription(`${client.i18n.get(language, "utilities", "control_set", {
                    toggle: "Enabled"
                })}`)
                .setColor(client.color)

            message.channel.send({ embeds: [embed] });
        }
    }
}