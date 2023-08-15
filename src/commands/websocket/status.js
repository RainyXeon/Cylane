module.exports = {
  name: "status",
  run: async (client, json, ws) => {
    if (!json.user)
      return ws.send(
        JSON.stringify({ error: "0x115", message: "No user's id provided" }),
      );
    if (!json.guild)
      return ws.send(
        JSON.stringify({ error: "0x120", message: "No guild's id provided" }),
      );
    const player = client.manager.players.get(json.guild);
    if (!player)
      return ws.send(
        JSON.stringify({ error: "0x100", message: "No player on this guild" }),
      );

    const Guild = await client.guilds.fetch(json.guild);
    const Member = await Guild.members.fetch(json.user);

    function playerState() {
      if (player.state == 5) return false;
      else if (player.state == 1) return true;
    }

    const song = player.queue.current;
    let webqueue = [];

    if (player.queue)
      player.queue.forEach((track) => {
        webqueue.push({
          title: track.title,
          uri: track.uri,
          length: track.length,
          thumbnail: track.thumbnail,
          author: track.author,
          requester: track.requester, // Just case can push
        });
      });

    return ws.send(
      JSON.stringify({
        op: "status",
        guild: player.guildId,
        loop: player.loop,
        member: !Member.voice.channel || !Member.voice ? false : true,
        pause: player.paused,
        playing: playerState(),
        current: song
          ? {
              title: song.title,
              uri: song.uri,
              length: song.length,
              thumbnail: song.thumbnail,
              author: song.author,
              requester: song.requester,
            }
          : null,
        queue: webqueue ? webqueue : null,
      }),
    );
  },
};
