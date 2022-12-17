module.exports = async (client, message, ws) => {
  let player
  const json = JSON.parse(message)
  try {
    switch (json.message) {
      case "resume":
        player = client.manager.players.get(json.guild)
        if (!player) return ws.send(JSON.stringify({ error: "0x100" }))
        player.pause(false)
        ws.send(JSON.stringify({ guild: player.guildId, player_status: 4 }))
        break
      
      case "pause":
        player = client.manager.players.get(json.guild)
        if (!player) return ws.send(JSON.stringify({ error: "0x100" }))
        player.pause(true)
        ws.send(JSON.stringify({ guild: player.guildId, player_status: 3 }))
        break
      
      case "search":
        const result = await client.manager.search(json.query)
        ws.send(JSON.stringify({ guild: json.guild, queue: result.tracks }))
        break

      case "destroy":
        player = client.manager.players.get(json.guild)
        if (!player) return ws.send(JSON.stringify({ error: "0x100" }))
        player.destroy()
        ws.send(JSON.stringify({ guild: player.guildId, player_status: 0 }))
        break

      case "skip":
        player = client.manager.players.get(json.guild)
        if (!player) return ws.send(JSON.stringify({ error: "0x100" }))
        if (player.queue.size == 0) {
          player.destroy()
          return ws.send(JSON.stringify({ guild: player.guildId, player_status: 0 }))
        }
        player.skip()
        ws.send(JSON.stringify({ guild: player.guildId, player_status: 5 }))
        break

      case "previous":
        player = client.manager.players.get(json.guild)
        if (!player) return ws.send(JSON.stringify({ error: "0x100" }))
        if (player.queue.size == 0) {
          player.destroy()
          return ws.send(JSON.stringify({ guild: player.guildId, player_status: 0 }))
        }
        if (!player.queue.previous) return ws.send(JSON.stringify({ error: "0x105" }))
        player.queue.unshift(player.queue.previous);
        player.skip()
        ws.send(JSON.stringify({ guild: player.guildId, player_status: 6 }))
        break
    }
  } catch (err) {
    ws.send(JSON.stringify({ error: err }))
  }
}