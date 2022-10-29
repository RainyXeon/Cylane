module.exports = async (client, player, track, playload) => {
  if (player.autoplay === true) {
      const requester = player.autoplay.requester
      const identifier = player.queue.current.identifier;
      const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
      let res = await player.search(search, requester);
      
      player.queue.add(res.tracks[1]);
  }
  client.logger.info(`Player Empty in @ ${player.guildId}`);
  await player.destroy()
}