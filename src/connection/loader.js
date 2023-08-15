module.exports = async (client) => {
  if (!client.shard_status) {
    const loadFile = [
      "loadCheck",
      "loadNodeEvents",
      "loadPlayer",
      "loadEvent",
      "loadWebSocket",
      "loadWsMessage",
      "loadCommand",
      "loadPrefixCommand",
    ];

    if (!client.config.features.WEBSOCKET.enable) {
      loadFile.splice(loadFile.indexOf("loadWebSocket"), 1);
      loadFile.splice(loadFile.indexOf("loadWsMessage"), 1);
    }

    if (!client.config.features.MESSAGE_CONTENT.enable)
      loadFile.splice(loadFile.indexOf("loadPrefixCommand"), 1);

    if (!client.config.features.AUTOFIX_LAVALINK) {
      loadFile.splice(loadFile.indexOf("loadCheck"), 1);
    }

    loadFile.forEach((x) => require(`../handlers/${x}`)(client));
  } else if (client.shard_status) {
    const shardLoadFile = [
      "loadCheck",
      "loadCommand",
      "loadPrefixCommand",
      "loadEvent",
      "loadNodeEvents",
      "loadPlayer",
    ];

    if (!client.config.features.AUTOFIX_LAVALINK) {
      shardLoadFile.splice(shardLoadFile.indexOf("loadCheck"), 1);
    }
    if (!client.config.features.MESSAGE_CONTENT.enable)
      shardLoadFile.splice(shardLoadFile.indexOf("loadPrefixCommand"), 1);

    shardLoadFile.forEach((x) => require(`../handlers/${x}`)(client));
  }
};
