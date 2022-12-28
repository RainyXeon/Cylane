module.exports = {
  name: "add",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild)
    
    if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
    if (json.tracks && json.query) return ws.send(JSON.stringify({ error: "0x110", message: "Only 1 - 2 params" }))

    if (json.tracks) {
      for (let track of json.tracks) player.queue.add(track)
      ws.send(JSON.stringify({ op: 7, guild: json.guild, queue: json.tracks }))
      
      return client.logger.info(`Added player tracks via websockets [tracks params] @ ${json.guild}`)
    } else if (json.query) {
      const res = await client.manager.search(json.query)
      if (res.type === 'PLAYLIST' || res.type === 'SEARCH') for (let track of res.tracks) player.queue.add(track)

      ws.send(JSON.stringify({ op: 7, guild: json.guild, queue: res.tracks }))
      client.logger.info(`Added player tracks via websockets [query params] @ ${json.guild}`)
    }
  }
}