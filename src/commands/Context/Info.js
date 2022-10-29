const { ContextMenuInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const ms = require('pretty-ms');

module.exports = { 
    name: "Info",
    type: 3,
    /**
     * @param {ContextMenuInteraction} interaction
     */
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        const info = new EmbedBuilder()
        .setTitle(client.user.tag + " Status")
        .addFields([
            { name: 'Uptime', value: `\`\`\`${ms(client.uptime)}\`\`\``, inline: true },
            { name: 'WebSocket Ping', value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },
            { name: 'Memory', value: `\`\`\`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap\`\`\``, inline: true },
            { name: 'Guild Count', value: `\`\`\`${client.guilds.cache.size} guilds\`\`\``, inline: true },
            { name: 'User Count', value: `\`\`\`${client.users.cache.size} users\`\`\``, inline: true },
            { name: 'Node', value: `\`\`\`${process.version} on ${process.platform} ${process.arch}\`\`\``, inline: true },
            { name: 'Cached Data', value: `\`\`\`${client.users.cache.size} users\n${client.emojis.cache.size} emojis\`\`\``, inline: true },
            { name: 'Discord.js', value: `\`\`\`${version}\`\`\``, inline: true },
        ])
        .setTimestamp()
        .setFooter({ text: "Hope you like me!" })
        .setColor(client.color);

        const row = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setLabel("Invite Me")
                .setStyle("Link")
                .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
            )

        await interaction.editReply({ embeds: [info], components: [row] });
    }
}