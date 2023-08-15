module.exports = {
  name: "resume",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild);

    if (!player)
      return ws.send(
        JSON.stringify({ error: "0x100", message: "No player on this guild" }),
      );
    player.pause(false);

    ws.send(JSON.stringify({ guild: player.guildId, op: "resume_track" }));
  },
};
