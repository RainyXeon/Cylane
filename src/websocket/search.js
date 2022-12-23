module.exports = {
  name: "search",
  run: async (client, json, ws) => {
    const result = await client.manager.search(json.query)
    
    ws.send(JSON.stringify({ guild: json.guild, queue: result.tracks }))

    client.logger.info(`Used search player via websockets @ ${json.guild}`)
  }
}