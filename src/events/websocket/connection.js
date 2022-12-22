const Function = require("../../websocket/function.js")
module.exports = {
 run: async (client, ws) => {
    client.logger.info('Connected to client!')
    ws.on('message', (message) => {
      Function(client, message, ws)
    })
    ws.on('error', (error) => {
      ws.send(JSON.stringify({ error: error }))
    })
    client.websocket = ws
  }
}