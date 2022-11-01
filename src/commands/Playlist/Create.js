const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../plugins/schemas/playlist.js");

module.exports = {
    name: "pl-create",
    description: "Create a new playlist",
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
        if(value.length > 16) return interaction.editReply(`${client.i18n.get(language, "playlist", "create_toolong")}`);

        const PlaylistName = value.replace(/_/g, ' ');
        const msg = await interaction.editReply(`${client.i18n.get(language, "playlist", "create_loading")}`);

        const Limit = await Playlist.find({ owner: interaction.user.id }).countDocuments();
        const Exist = await Playlist.findOne({ name: PlaylistName });

        if(Exist) { msg.edit(`${client.i18n.get(language, "playlist", "create_name_exist")}`); return; }
        if(Limit >= client.config.LIMIT_PLAYLIST) { msg.edit(`${client.i18n.get(language, "playlist", "create_limit_playlist", {
            limit: client.config.LIMIT_PLAYLIST
        })}`); return; }

        const CreateNew = new Playlist({
            name: PlaylistName,
            owner: interaction.user.id,
            tracks: [],
            private: true,
            created: Date.now()
        });

        CreateNew.save().then(() => {
            const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "playlist", "create_created", {
                playlist: PlaylistName
                })}`)
            .setColor(client.color)
        msg.edit({ content: " ", embeds: [embed] });
        });
    }
}