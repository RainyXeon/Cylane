const { PermissionsBitField, InteractionType } = require("discord.js");
const logger = require('../../plugins/logger.js')
const YouTube = require("youtube-sr").default;
const { DEFAULT } = require("../../plugins/config.js")

module.exports = async(client, interaction) => {
    if (interaction.isCommand || interaction.isContextMenuCommand || interaction.isModalSubmit || interaction.isChatInputCommand) {
        if (!interaction.guild || interaction.user.bot) return;

        if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            if (interaction.commandName == "play") {
                const Random = DEFAULT[Math.floor(Math.random() * DEFAULT.length)];
                let choice = []
                await YouTube.search(interaction.options.get("search").value || Random, { safeSearch: true, limit: 10 }).then(result => {
                    result.forEach((x) => { choice.push({ name: x.title, value: x.url }) })
                });
                await interaction.respond(choice).catch(() => { });
            }
        }

        const command = client.slash.get(interaction.commandName);

        if(!command) return;
        if (!client.dev.includes(interaction.user.id) && client.dev.length > 0) { 
            interaction.reply(`${client.i18n.get(language, "interaction", "dev_only")}`); 
            logger.info(`[INFOMATION] ${interaction.user.tag} trying request the command from ${interaction.guild.name} (${interaction.guild.id})`); 
            return;
        }

        logger.info(`[COMMAND] ${command.name} used by ${interaction.user.tag} from ${interaction.guild.name} (${interaction.guild.id})`);

        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.SendMessages)) return interaction.user.dmChannel.send(`I don't have \`SendMessages\`perms to execute command!`);
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(`I don't have \`EmbedLinks\` perms to execute command!`);
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Speak)) return interaction.reply(`I don't have perms \`Speak\` to execute command!`);
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Connect)) return interaction.reply(`I don't have perms \`Connect\` to execute command!`);
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply(`I don't have \`ManageMessages\` perms to execute command!`);
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply(`I don't \`ManageChannels\` have perms to execute command!`);

    if (!command) return;
    if (command) {
        try {
            command.run(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({ content: `${client.i18n.get(language, "interaction", "error")}`, ephmeral: true });
        }}
    }
}