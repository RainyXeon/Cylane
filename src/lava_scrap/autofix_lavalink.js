const regex = /^(wss?|ws?:\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[^\/]+):([0-9]{1,5})$/
module.exports = async (client) => {
  client.logger.info("----- Starting autofix lavalink... -----")

  if (client.manager.shoukaku.nodes && client.lavalink_using.length == 0) {
    client.manager.shoukaku.nodes.forEach((data, index) => {
        const res = regex.exec(data.url)
        client.lavalink_using.push({
            host: res[2],
            port: res[3],
            pass: data.auth,
            secure: res[1] == "ws://" ? false : true,
            name: index
        })
    })
  }

  // Remove current

  await client.manager.shoukaku.removeNode(client.lavalink_using[0].name)
  client.lavalink_using.splice(0, 1);

  // Fix when have lavalink

  const online_list = []

  client.lavalink_list.filter(async (data) => {
    if (data.online == true) return online_list.push(data)
  })

  const node_info = online_list[0]

  const new_node_info = {
    name: `${node_info.host}:${node_info.port}`,
    url: `${node_info.host}:${node_info.port}`,
    auth: node_info.pass,
    secure: node_info.secure
  }

  await client.manager.shoukaku.addNode(new_node_info)

  client.lavalink_using.push({
    host: node_info.host,
    port: node_info.port,
    pass: node_info.pass,
    secure: node_info.secure,
    name: `${node_info.host}:${node_info.port}`
  })
}