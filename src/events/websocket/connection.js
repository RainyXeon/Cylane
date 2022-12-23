module.exports = async (client, ws) => {
  client.logger.info('Connected to client!')

  ws.on('message', (message) => {
    const json = JSON.parse(message)
    const req = client.wss.message.get(json.message)
    
    if(!req) return;
    if (req) {
      try {
        req.run(client, json, ws);
      } catch (error) {
        client.logger.log({
          level: 'error',
          message: error
        })
        ws.send(JSON.stringify({ error: error }))
      }
    }
  
  })
  ws.on('error', (error) => {
    ws.send(JSON.stringify({ error: error }))
  })
  
  client.websocket = ws
}
