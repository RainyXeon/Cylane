const config = require("./plugins/config")

if (config.get.features.SHARD_SYSTEM.enable) {
  return require("./client/shard/index.js")
} else {
  return require("./client/original/index.js")
}