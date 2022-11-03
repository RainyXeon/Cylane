const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["test"],
    description: "Test the unofficial command",
    categories: "Admin",
    options: [
        {
            name: "user",
            description: "Type your user here",
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        if(interaction.user.id != client.owner) return interaction.editReply({ content: `${client.i18n.get(language, "interaction", "owner_only")}` });
        const value = interaction.options.getUser("user")

        if (value) {
            const embed = new EmbedBuilder()
                .setTitle(value.username + " " + value.discriminator)
                .setImage(`https://cdn.discordapp.com/avatars/${value.id}/${value.avatar}.jpeg?size=300`)
                .setColor(client.color)
                .setFooter({ text: `© ${interaction.guild.members.me.displayName}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            await interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setTitle(interaction.user.username + " " + interaction.user.discriminator)
                .setImage(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg?size=300`)
                .setColor(client.color)
                .setFooter({ text: `© ${interaction.guild.members.me.displayName}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            await interaction.editReply({ embeds: [embed] });
        }     
    }
};