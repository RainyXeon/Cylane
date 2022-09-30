const { PermissionsBitField } = require("discord.js");
const logger = require("../../plugins/logger");

module.exports = async(client, interaction) => {
    if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
        if (!client.slash.has(interaction.commandName)) return;
        if (!interaction.guild) return;

        const command = client.slash.get(interaction.commandName);
        if(!command) return;
        if (!client.dev.includes(interaction.user.id) && client.dev.length > 0) { 
            interaction.reply(`The bot is under maintenance. (Please come back again later)`); 
            logger.debug(`[INFOMATION] ${interaction.user.tag} trying request the command from ${interaction.guild.name} (${interaction.guild.id})`); 
            return;
        }

        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.SendMessages)) return interaction.user.dmChannel.send(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Speak)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Connect)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply(`${client.i18n.get(language, "interaction", "no_perms")}`);

        if (command) {
            try {
                command.run(interaction, client);
            } catch (error) {
                console.log(error)
                await interaction.reply({ content: `Something went wrong.`, ephmeral: true });
            }
        }
    }
}