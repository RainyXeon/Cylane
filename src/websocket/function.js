module.exports = async (client, message, ws) => {
  let player
  const json = JSON.parse(message)
  switch (json.message) {
    case "resume":
      player = client.manager.players.get(json.guild)
      if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
      player.pause(false)
      ws.send(JSON.stringify({ guild: player.guildId, player_status: 4 }))
      client.logger.info(`Resumed player via websockets @ ${json.guild}`)
      break
    
    case "pause":
      player = client.manager.players.get(json.guild)
      if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
      player.pause(true)
      ws.send(JSON.stringify({ guild: player.guildId, player_status: 3 }))
      client.logger.info(`Paused player via websockets @ ${json.guild}`)
      break
    
    case "search":
      const result = await client.manager.search(json.query)
      ws.send(JSON.stringify({ guild: json.guild, queue: result.tracks }))
      client.logger.info(`Used search player via websockets @ ${json.guild}`)
      break

    case "destroy":
      player = client.manager.players.get(json.guild)
      if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
      player.destroy()
      ws.send(JSON.stringify({ guild: player.guildId, player_status: 0 }))
      client.logger.info(`Destroyed player via websockets @ ${json.guild}`)
      break

    case "skip":
      player = client.manager.players.get(json.guild)
      if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
      if (player.queue.size == 0) {
        player.destroy()
        return ws.send(JSON.stringify({ guild: player.guildId, player_status: 0 }))
      }
      player.skip()
      ws.send(JSON.stringify({ guild: player.guildId, player_status: 5 }))
      client.logger.info(`Skipped player via websockets @ ${json.guild}`)
      break

    case "previous":
      player = client.manager.players.get(json.guild)
      if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
      if (player.queue.size == 0) {
        player.destroy()
        return ws.send(JSON.stringify({ guild: player.guildId, player_status: 0 }))
      }
      if (!player.queue.previous) return ws.send(JSON.stringify({ error: "0x105", message: "No previous track" }))
      player.queue.unshift(player.queue.previous);
      player.skip()
      ws.send(JSON.stringify({ guild: player.guildId, player_status: 6 }))
      client.logger.info(`Previous player via websockets @ ${json.guild}`)
      break
    
    case "add":
      player = client.manager.players.get(json.guild)
      if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
      if (json.tracks && json.query) return ws.send(JSON.stringify({ error: "0x110", message: "Only 1 - 2 params" }))
      if (json.tracks) {
        for (let track of json.tracks) player.queue.add(track)
        ws.send(JSON.stringify({ player_status: 7, guild: json.guild, queue: json.tracks }))
        return client.logger.info(`Added player tracks via websockets [tracks params] @ ${json.guild}`)
      } else if (json.query) {
        const res = await client.manager.search(json.query)
        if (res.type === 'PLAYLIST' || res.type === 'SEARCH') for (let track of res.tracks) player.queue.add(track)
        ws.send(JSON.stringify({ player_status: 7, guild: json.guild, queue: res.tracks }))
        client.logger.info(`Added player tracks via websockets [query params] @ ${json.guild}`)
      }
      break

    case "play":
      player = client.manager.players.get(json.guild)
      if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
      if (player.playing) return
      if (player.queue.size == 0) {
        player.destroy()
        return ws.send(JSON.stringify({ guild: player.guildId, player_status: 0 }))
      }
      if (!player.playing) player.play()
      break

    case "pause_status":
      player = client.manager.players.get(json.guild)
      if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
      if (player.paused) return ws.send(JSON.stringify({ player_status: 3, guild: player.guildId }))
      else if (!player.paused) return ws.send(JSON.stringify({ player_status: 4, guild: player.guildId }))
      break

    case "playing_status":
      player = client.manager.players.get(json.guild)
      if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
      if (player.state == 5) return ws.send(JSON.stringify({ player_status: 0, guild: player.guildId }))
      else if (player.state == 1) return ws.send(JSON.stringify({ player_status: 1, guild: player.guildId }))
      break

    case "current_track_status":
      player = client.manager.players.get(json.guild)
      if (!player) return ws.send(JSON.stringify({ error: "0x100", message: "No player on this guild" }))
      const song = player.queue.current
      let webqueue = []

      player.queue.forEach(track => {
        webqueue.push(
          {
            title: track.title,
            uri: track.uri,
            length: track.length,
            thumbnail: track.thumbnail,
            author: track.author,
            requester: track.requester // Just case can push
          }
        )
      })

      return ws.send(JSON.stringify({ 
        player_status: 2, 
        guild: player.guildId, 
        current: {
          title: song.title,
          uri: song.uri,
          length: song.length,
          thumbnail: song.thumbnail,
          author: song.author,
          requester: song.requester
        }, 
        queue: webqueue 
      }))
      break

  }
}