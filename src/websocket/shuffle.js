module.exports = {
  name: "shuffle",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild)
    if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))

    player.queue.shuffle();

    ws.send(JSON.stringify({ guild: player.guildId, op: 11 }))
    client.logger.info(`Shuffled player via websockets @ ${json.guild}`)
  }
}