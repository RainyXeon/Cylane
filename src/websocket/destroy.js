module.exports = {
  name: "destroy",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild)
    if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
    
    player.destroy()

    ws.send(JSON.stringify({ guild: player.guildId, player_status: 0 }))
    client.logger.info(`Destroyed player via websockets @ ${json.guild}`)
  }
}