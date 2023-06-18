module.exports = async (client) => {
  if (!client.shard_status) {
    const loadFile = [
      "loadEvent",
      "loadNodeEvents",
      "loadPlayer",
      "loadWebSocket",
      "loadWsMessage",
      "loadCommand",
      "loadPrefixCommand",
      "loadCheck"
    ]

    if (!client.config.features.WEBSOCKET.enable){
      loadFile.splice(loadFile.indexOf('loadWebSocket'), 1);
      loadFile.splice(loadFile.indexOf('loadWsMessage'), 1);
    }

    if (!client.config.features.MESSAGE_CONTENT.enable) loadFile.splice(loadFile.indexOf('loadPrefixCommand'), 1);

    if (!client.config.get.features.AUTOFIX_LAVALINK) {
      loadFile.splice(loadFile.indexOf('loadCheck'), 1);
    }

    loadFile.forEach(x => require(`../handlers/${x}`)(client));

  } else if (client.shard_status) {
    const shardLoadFile = [
      "loadEvent",
      "loadNodeEvents",
      "loadPlayer",
      "loadCommand",
      "loadPrefixCommand",
      "loadCheck"
    ]

    if (!client.config.get.features.AUTOFIX_LAVALINK) {
      shardLoadFile.splice(shardLoadFile.indexOf('loadCheck'), 1);
    }
    if (!client.config.features.MESSAGE_CONTENT.enable) shardLoadFile.splice(shardLoadFile.indexOf('loadPrefixCommand'), 1);
    
    shardLoadFile.forEach(x => require(`../handlers/${x}`)(client));
  }
}