module.exports = {
  name: "previous",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild)
    if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))

    if (player.queue.size == 0) {
      player.destroy()
      return ws.send(JSON.stringify({ guild: player.guildId, op: "player_destroy" }))
    }

    if (!player.queue.previous) return ws.send(JSON.stringify({ error: "0x105", message: "No previous track" }))

    player.queue.unshift(player.queue.previous);
    player.skip()
    
    ws.send(JSON.stringify({ guild: player.guildId, op: "previous_track" }))
    client.logger.info(`Previous player via websockets @ ${json.guild}`)
  }
}