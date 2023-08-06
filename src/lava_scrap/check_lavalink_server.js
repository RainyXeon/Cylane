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

  if (client.lavalink_list.length !== 0) client.lavalink_list.length = 0

  for (let i = 0; i < lavalink_data.length; i++) {
    const config = lavalink_data[i]
    let headers = {
      'Client-Name': 'shoukakubot/3.3.1 (https://github.com/Deivu/Shoukaku)',
      'User-Agent': 'shoukakubot/3.3.1 (https://github.com/Deivu/Shoukaku)',
      'Authorization': config.pass,
      'User-Id': "977148321682575410",
      'Resume-Key': 'Shoukaku@3.3.1(https://github.com/Deivu/Shoukaku)',
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
    }).catch(err => {
      client.lavalink_list.push({
        host: config.host,
        port: config.port,
        pass: config.pass,
        secure: config.secure,
        name: `${config.host}:${config.port}`,
        online: false
      }) 
    });

  }
}