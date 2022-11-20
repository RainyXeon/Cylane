const Cluster = require('discord-hybrid-sharding');
const logger = require('../../plugins/logger')
const config = require("../../plugins/config.js");
const manager = new Cluster.Manager(`${__dirname}/login.js`, {
    totalShards: 'auto', // you can set to every number you want but for save mode, use 'auto' option
    totalClusters: 'auto', // you can set to every number you want but for save mode, use 'auto' option
    shardsPerClusters: 2,
    mode: 'process', // you can also choose "worker"
    token: config.TOKEN,
});

manager.on('clusterCreate', cluster => logger.info(`Launched Cluster ${cluster.id}`));
manager.spawn({ timeout: -1 });