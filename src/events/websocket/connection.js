const Function = require("../../websocket/function.js")
module.exports = {
 run: async (client, ws) => {
    client.logger.info('Connected to client!')
    ws.on('message', (message) => {
      Function(client, message, ws)
    })
    client.websocket = ws
  }
}