const config = require("./plugins/config")

if (config.features.SHARD_SYSTEM.enable) {
  return require("./boot/shard/index.js")
} else {
  return require("./boot/original/index.js")
}