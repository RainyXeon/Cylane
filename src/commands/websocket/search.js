module.exports = {
  name: "search",
  run: async (client, json, ws) => {
    const result = await client.manager.search(json.query, { engine: json.source ? json.source : "soundcloud" })
    
    ws.send(JSON.stringify({ op: "search", guild: json.guild, queue: result.tracks }))

    client.logger.info(`Used search player via websockets @ ${json.guild}`)
  }
}