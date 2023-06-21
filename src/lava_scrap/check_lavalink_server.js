const getLavalinkServer = require("./get_lavalink_server")
const Websocket = require("ws")
module.exports = async (client) => {
  client.logger.info("Running check lavalink server from [https://lavalink.darrennathanael.com/] source")

  const lavalink_data = await getLavalinkServer()
  const lavalink_list = []
  const version = 3

  function checkServerStatus(url, headers) {
    return new Promise((resolve, reject) => {
      const ws = new Websocket(url, { headers });
      ws.onopen = () => {
        resolve(ws.readyState);
        ws.close();
      };
      ws.onerror = (e) => {
        reject(e);
      };
    });
  }

  for (let i = 0; i < lavalink_data.length; i++) {
    const config = lavalink_data[i]
    let headers

    if (client.manager.shoukaku.options.resumeKey) {
      headers = {
        'Client-Name': client.manager.shoukaku.options.userAgent,
        'User-Agent': client.manager.shoukaku.options.userAgent,
        'Authorization': config.pass,
        'User-Id': client.manager.shoukaku.id,
        'Resume-Key': client.manager.shoukaku.options.resumeKey
      };
    } else if (!client.manager.shoukaku.options){
      headers = {
        'Client-Name': 'shoukakubot/3.3.1 (https://github.com/Deivu/Shoukaku)',
        'User-Agent': 'shoukakubot/3.3.1 (https://github.com/Deivu/Shoukaku)',
        'Authorization': config.pass,
        'User-Id': client.config.get.bot.ID,
        'Resume-Key': 'Shoukaku@3.3.1(https://github.com/Deivu/Shoukaku)',
      }
    } else {
      headers = {
        'Client-Name': client.manager.shoukaku.options.userAgent,
        'User-Agent': client.manager.shoukaku.options.userAgent,
        'Authorization': config.pass,
        'User-Id': client.manager.shoukaku.id
      };
    }

    const url = `ws://${config.host}:${config.port}/v3/websocket`

    checkServerStatus(url, headers).then(val => {
      client.lavalink_list.push({
        host: config.host,
        port: config.port,
        pass: config.pass,
        secure: config.secure,
        name: `${config.host}:${config.port}`,
        online: true
      }) 
      client.logger.online(`Server: ${url}`)
    }).catch(err => {
      client.lavalink_list.push({
        host: config.host,
        port: config.port,
        pass: config.pass,
        secure: config.secure,
        name: `${config.host}:${config.port}`,
        online: false
      }) 
      client.logger.offline(`Server: ${url}`)
    });

  }
}