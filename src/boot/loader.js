module.exports = async (client) => {
  if (!client.shard_status) {
  const loadFile = [
    "loadCommand",
    "loadPrefixCommand",
    "loadEvent",
    "loadPlayer",
    "loadNodeEvents",
    "loadWebSocket",
    "loadWsMessage"
  ]

  if (!client.config.features.WEBSOCKET.enable){
    loadFile.splice(loadFile.indexOf('loadWebSocket'), 1);
    loadFile.splice(loadFile.indexOf('loadWsMessage'), 1);
  }

  if (!client.config.features.MESSAGE_CONTENT.enable) loadFile.splice(loadFile.indexOf('loadPrefixCommand'), 1);

  loadFile.forEach(x => require(`../handlers/${x}`)(client));

  } else if (client.shard_status) {
    const shardLoadFile = [
      "loadCommand",
      "loadPrefixCommand",
      "loadEvent",
      "loadDatabase",
      "loadPlayer",
      "loadNodeEvents"
  ]

  if (!client.config.features.MESSAGE_CONTENT.enable) shardLoadFile.splice(shardLoadFile.indexOf('loadPrefixCommand'), 1);
  
  shardLoadFile.forEach(x => require(`../../handlers/${x}`)(this));
  }
}