const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../plugins/schemas/playlist.js");

module.exports = {
    name: "pl-delete",
    description: "Delete a playlist",
    category: "Playlist",
    options: [
        {
            name: "name",
            description: "The name of the playlist",
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });

        const value = interaction.options.getString("name");
        const Plist = value.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: Plist });

        if(!playlist) return interaction.editReply(`${client.i18n.get(language, "playlist", "delete_notfound")}`);
        if(playlist.owner !== interaction.user.id) return interaction.editReply(`${client.i18n.get(language, "playlist", "delete_owner")}`);

        await playlist.delete();
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "playlist", "delete_deleted", {
                name: Plist
                })}`)
            .setColor(client.color)
        interaction.editReply({ embeds: [embed] });
    }
}