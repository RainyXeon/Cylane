module.exports = {
  name: "skip",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild);
    if (!player)
      return ws.send(
        JSON.stringify({ error: "0x100", message: "No player on this guild" }),
      );

    const current = player.queue.current;

    if (player.queue.size == 0) {
      player.destroy();
      return ws.send(
        JSON.stringify({ guild: player.guildId, op: "player_destroy" }),
      );
    }

    player.skip();

    const song = player.queue.current;

    await client.websocket.send(
      JSON.stringify({
        op: "player_start",
        guild: player.guildId,
        current: {
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
