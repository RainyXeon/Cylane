const regex =
  /^(wss?|ws?:\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[^\/]+):([0-9]{1,5})$/;

module.exports = async (client, name) => {
  client.fixing_nodes = false;
  client.manager.shoukaku.nodes.forEach((data, index) => {
    const res = regex.exec(data.url);
    client.lavalink_using.push({
      host: res[2],
      port: res[3],
      pass: data.auth,
      secure: res[1] == "ws://" ? false : true,
      name: index,
    });
  });

  client.logger.info(`Lavalink [${name}] connected.`);
};
