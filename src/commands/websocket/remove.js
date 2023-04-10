module.exports = {
  name: "remove",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild)
    if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))

    const index = player.queue.map((e) => e.uri).indexOf(json.uri);

    if (index == -1) return player.skip()

    else if (index != -1) {
      const removed = player.queue[index]
      player.queue.splice(index, 1);

      ws.send(JSON.stringify({
        op: "removed_track", 
        guild: player.guildId,
        uri: removed.uri
      }))
    }
  }
}