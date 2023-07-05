const Cluster = require('discord-hybrid-sharding');
const logger = require('../../plugins/logger')
const config = require("../../plugins/config.js");

process.on('unhandledRejection', error => logger.log({ level: 'error', message: error }));
process.on('uncaughtException', error => logger.log({ level: 'error', message: error }));

async function run() {
    const manager = new Cluster.Manager(`${__dirname}/login.js`, {
        totalShards: config.features.SHARD_SYSTEM.totalShards, // you can set to every number you want but for save mode, use 'auto' option
        totalClusters: config.features.SHARD_SYSTEM.totalClusters, // you can set to every number you want but for save mode, use 'auto' option
        shardsPerClusters: config.features.SHARD_SYSTEM.shardsPerClusters,
        mode: config.features.SHARD_SYSTEM.mode, // you can also choose "worker"
        token: config.TOKEN,
    });
    
    await manager.on('clusterCreate', cluster => logger.info(`Launched Cluster ${cluster.id}`));
    await manager.spawn({ timeout: -1 });
}
run()