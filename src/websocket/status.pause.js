module.exports = {
  name: "pause_status",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild)
    if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
    if (player.paused) return ws.send(JSON.stringify({ player_status: 3, guild: player.guildId }))
    else if (!player.paused) return ws.send(JSON.stringify({ player_status: 4, guild: player.guildId }))
  }
}