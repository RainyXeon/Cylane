module.exports = {
  name: "pause",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild);
    if (!player)
      return ws.send(
        JSON.stringify({ error: "0x100", message: "No player on this guild" }),
      );

    player.pause(true);

    ws.send(JSON.stringify({ guild: player.guildId, op: "pause_track" }));
  },
};
