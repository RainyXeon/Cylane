const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { convertTime } = require("../../structures/ConvertTime.js");
const { StartQueueDuration } = require("../../structures/QueueDuration.js");
const Playlist = require("../../plugins/schemas/playlist.js");
const { stripIndents } = require("common-tags");
const humanizeDuration = require('humanize-duration');

const TrackAdd = [];

module.exports = {
    name: ["playlist", "edit"],
    description: "Edit the playlist infomation",
    categories: "Playlist",
    options: [
      {
        name: "name",
        description: "The name of the playlist",
        required: true,
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "rename",
        description: "The new name of the playlist",
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "description",
        description: "The description of the playlist",
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "id",
        description: "The id of the playlist",
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "private",
        description: "The private mode of the playlist",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
              name: "Enable",
              value: "enable"
          },
          {
              name: "Disable",
              value: "disable"
          }
        ]
      },
      {
        name: "add",
        description: "Search and add track to the playlist",
        type: ApplicationCommandOptionType.String,
        autocomplete: true
      },
      {
        name: "remove",
        description: "Remove track to the playlist",
        type: ApplicationCommandOptionType.String,
        autocomplete: true
      },
    ],
    run: async (interaction, client, language) => {
      const name = interaction.options.getString("name")
      const PlaylistName = name.replace(/_/g, ' ');
      const newname = interaction.options.getString("rename") ? interaction.options.getString("rename") : null
      const id = interaction.options.getString("id") ? interaction.options.getString("id") : null
      const des = interaction.options.getString("description") ? interaction.options.getString("description") : null
      const get_private = interaction.options.getString("private") ? interaction.options.getString("private") : null
      const add = interaction.options.getString("add") ? interaction.options.getString("add") : null
      const remove = interaction.options.getString("remove") ? interaction.options.getString("remove") : null
      const playlist = await Playlist.findOne({ name: PlaylistName, owner: interaction.user.id })
      const Exist = await Playlist.findOne({ id: id });

      function parseBoolean(value){
        if (typeof(value) === 'string'){
            value = value.trim().toLowerCase();
        }
        switch(value){
          case "enable":
            return true
          case "disable":
            return false;
          case null:
            return null
        }
      }

      const private = parseBoolean(get_private)

      async function RunCommands(newname, des, id, private, add, remove) {
        try {
          await interaction.deferReply({ ephemeral: false });
          if(Exist) return interaction.editReply("This ID is already in use, please try another ID.")
          const embed = new EmbedBuilder()
            .setTitle("New Edit:")
            .setDescription(stripIndents`**Name:** \`${newname !== null ? newname : name}\`
            **ID:** \`${id !== null ? id : playlist.id}\`
            **Description:** \`${des !== null ? des : playlist.description}\`
            **Private:** \`${private !== null ? private : playlist.private}\`
            **Added:** \`${add !== null ? add : "No added song url"}\`
            **Removed:** \`${remove !== null ? remove : "No removed song url"}\` `)
            .setColor(client.color)
          const row = new ActionRowBuilder()
            .addComponents([
              new ButtonBuilder()
                .setCustomId("no")
                .setEmoji("✖️")
                .setLabel("No")
                .setStyle("Danger"),
      
              new ButtonBuilder()
                .setCustomId("yes")
                .setEmoji("✔️")
                .setLabel("Yes")
                .setStyle("Success"),
            ])
          const msg = await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true })
          const collector = msg.createMessageComponentCollector({ time: 15000 })
          collector.on('collect', async (message) => {
            const col_id = message.customId;
            if (col_id == "no") {
              await message.reply({ content: 'Canceled change!'})
              msg.edit({ components: [] })
              collector.stop();
            } else if(col_id == "yes") {
              if (add) {
                const result = await client.manager.search(add, { requester: interaction.user })
                const tracks = result.tracks
                if (result.type === 'PLAYLIST') for (let track of tracks) TrackAdd.push(track) 
                else TrackAdd.push(tracks[0]);
                
                const LimitTrack = tracks.length + TrackAdd.length;
                if(LimitTrack > client.config.LIMIT_TRACK) { interaction.followUp(`${client.i18n.get(language, "playlist", "add_limit_track", {
                    limit: client.config.LIMIT_TRACK
                })}`); TrackAdd.length = 0; return; }

                TrackAdd.forEach(track => {
                  playlist.tracks.push(
                    {
                      title: track.title,
                      uri: track.uri,
                      length: track.length,
                      thumbnail: track.thumbnail,
                      author: track.author,
                      requester: track.requester // Just case can push
                    }
                  )
                });
              }

              playlist.id = id !== null ? id : playlist.id,
              playlist.name = newname !== null ? newname : PlaylistName,
              playlist.private =  private !== null ? private : playlist.private,
              playlist.description = des !== null ? des : playlist.description,
              
              playlist.save().then(async () => {
                await message.reply({ content: 'Change accepted!' })
                msg.edit({ components: [] })
                collector.stop();
              }).catch((e) => console.log(e))

            }
          })
          collector.on('end', async (collected, reason) => {
            if(reason === "time") {
              msg.edit({ content: `Canceled change because time out!`, embeds: [], components: []})
            }
          });

          console.log(newname, des, id, private, add, remove)
        } catch (e) { }
      }
      if (interaction.options.getString("add") || interaction.options.getString("remove")) {
        console.log("Edit mode")
        return RunCommands(newname, des, id, private, add, remove)
      }
      console.log("Raw mode")
      RunCommands(newname, des, id, private, add, remove)
    }
}