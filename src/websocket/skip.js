module.exports = {
  name: "skip",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild)
    if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))

    const current = player.queue.current

    if (player.queue.size == 0) {
      player.destroy()
      return ws.send(JSON.stringify({ guild: player.guildId, op: "player_destroy" }))
    }

    player.skip()

    client.logger.info(`Skipped player via websockets @ ${json.guild}`)
  }
}