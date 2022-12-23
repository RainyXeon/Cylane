module.exports = {
  name: "current_track_status",
  run: async (client, json, ws) => {
    const player = client.manager.players.get(json.guild)

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
  }
}