const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "play",
    description: "Play a song from any types",
    options: [
        {
            name: "search",
            description: "The song link or name",
            type: 3,
            required: true,
            autocomplete: true
        }
    ],
    run: async (interaction, client) => {
        try {
            if (interaction.options.getString("search")) {
                await interaction.deferReply({ ephemeral: false });
                const value = interaction.options.get("search").value;
                const { channel } = interaction.member.voice;
        
                const msg = await interaction.editReply(`Loading...`);
                if (!channel) return msg.edit(`You need to be in the voice channel!`);
                if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Connect)) return msg.edit(`I don't have \`CONNECT\` permissions to run this command!`);
                if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.Flags.Speak)) return msg.edit(`I don't have \`SPEAK\` permissions to execute this command!`);
        
                const player = await client.manager.createPlayer({
                    guildId: interaction.guild.id,
                    voiceId: interaction.member.voice.channel.id,
                    textId: interaction.channel.id,
                    deaf: true,
                  });
                const result = await player.search(value, interaction.user);
                const tracks = result.tracks;
        
                if (!result.tracks.length) return msg.edit({ content: 'No result was found' });
                if (result.type === 'PLAYLIST') for (let track of tracks) player.play(track);
                else player.play(tracks[0]);
        
                if (result.type === 'PLAYLIST'){
                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued ${tracks.length} from ${result.playlistName}**`)
                        .setColor(client.color)
                    msg.edit({ content: " ", embeds: [embed] });
                } else if (result.type === 'TRACK') {
                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued [${tracks[0].title}](${tracks[0].uri})**`)
                        .setColor(client.color)
                    msg.edit({ content: " ", embeds: [embed] });
                } else if (result.type === 'SEARCH') {
                    const embed = new EmbedBuilder()
                        .setDescription(`**Queued [${tracks[0].title}](${tracks[0].uri})**`)
                        .setColor(client.color)
                    msg.edit({ content: " ", embeds: [embed] });
                }        
            }
        } catch (e) {
            
        }        
    }
};
