module.exports = {
  name: "loop_status",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild)
    if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
    return ws.send(JSON.stringify({ op: "loop_queue", guild: player.guildId, status: player.loop }))
  }
}