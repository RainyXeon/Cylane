module.exports = {
  name: "join",
  run: async (client, json, ws) => {
    if (!json.user) return ws.send(JSON.stringify({ error: "0x115", message: "No user's id provided" }))
    if (!json.guild) return ws.send(JSON.stringify({ error: "0x120", message: "No guild's id provided" }))

    const Guild = client.guilds.cache.get(json.guild);
    const Member = Guild.members.cache.get(json.user);

    await client.manager.createPlayer({
      guildId: Guild.id,
      voiceId: Member.voice.channel.id,
      deaf: true,
    });

    ws.send(JSON.stringify({ guild: json.guild, op: "player_create" }))
    client.logger.info(`Joined player via websockets @ ${json.guild}`)
  }
}