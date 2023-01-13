module.exports = {
  name: "pause_status",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild)
    if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
    return ws.send(JSON.stringify({ op: player.paused ? "pause_track" : "resume_track", guild: player.guildId }))
  }
}