const Cluster = require("discord-hybrid-sharding");
const logger = require("../../plugins/logger");
const config = require("../../plugins/config.js");

process.on("unhandledRejection", (error) =>
  logger.log({ level: "error", message: error }),
);
process.on("uncaughtException", (error) =>
  logger.log({ level: "error", message: error }),
);

// Log Discord token for debugging
logger.info(`Discord Token: ${config.bot.TOKEN}`);

async function run() {
  const manager = new Cluster.Manager(`${__dirname}/login.js`, {
    totalShards: config.features.SHARD_SYSTEM.totalShards,
    totalClusters: config.features.SHARD_SYSTEM.totalClusters,
    shardsPerClusters: config.features.SHARD_SYSTEM.shardsPerClusters,
    mode: config.features.SHARD_SYSTEM.mode,
    token: config.bot.TOKEN, // Fix: Use config.bot.TOKEN
  });

  manager.on("clusterCreate", (cluster) => {
    logger.info(`Launched Cluster ${cluster.id}`);
  });

  await manager.spawn({ timeout: -1 });
}

run();
