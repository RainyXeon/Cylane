module.exports = async (client, ws, request) => {
  client.logger.info('Connected to client!')

  const verificationOrigin = request.headers.origin

  if (client.config.AUTHENICATOR && !client.config.TRUSTED_ORIGIN.includes(verificationOrigin)){
    ws.close()
    client.logger.info(`Disconnected to client (${verificationOrigin}) beacuse it's not in trusted list!`)
    return
  } 

  if (!client.config.AUTHENICATOR) client.logger.warn(`[UNSECURE] Connected to client (${verificationOrigin})`)

  if (client.config.AUTHENICATOR) client.logger.info(`Connected to client (${verificationOrigin})`)

  ws.on('message', (message) => {
    const json = JSON.parse(message)
    const req = client.wss.message.get(json.message)
    
    if(!req) return;
    if (req) {
      client.logger.info(`Used [${json.message}] req by ${json.guild}`)
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
