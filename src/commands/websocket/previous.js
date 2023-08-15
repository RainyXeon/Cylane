module.exports = {
  name: "previous",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild);
    if (!player)
      return ws.send(
        JSON.stringify({ error: "0x100", message: "No player on this guild" }),
      );

    if (player.queue.size == 0) {
      player.destroy();
      return ws.send(
        JSON.stringify({ guild: player.guildId, op: "player_destroy" }),
      );
    }

    const song = player.queue.previous;

    if (!song)
      return ws.send(
        JSON.stringify({
          error: "0x105",
          message: "No previous track",
          guild: player.guildId,
        }),
      );

    player.queue.unshift(song);
    player.skip();

    ws.send(
      JSON.stringify({
        op: "previous_track",
        guild: player.guildId,
        track: {
          title: song.title,
          uri: song.uri,
          length: song.length,
          thumbnail: song.thumbnail,
          author: song.author,
          requester: song.requester,
        },
      }),
    );
  },
};
