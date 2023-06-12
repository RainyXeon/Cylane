module.exports = async (client, name) => {
    client.logger.info(`Lavalink [${name}] connected.`);
    client.logger.info("Auto ReConnect Collecting player 24/7 data");
    const maindata = await client.db.get(`autoreconnect`)
    if (!maindata) return client.logger.info(`Auto ReConnect found in 0 servers!`);

    client.logger.info(`Auto ReConnect found in ${Object.keys(maindata).length} servers!`);
    if (Object.keys(maindata).length === 0) return

    Object.keys(maindata).forEach(async function(key, index) {
        const data = maindata[key];

        setTimeout(async () => {
            const channel = client.channels.cache.get(data.text)
            const voice = client.channels.cache.get(data.voice)
            if (!channel || !voice) return data.delete()
            const player = await client.manager.createPlayer({
                guildId: data.guild,
                voiceId: data.voice,
                textId: data.text,
                deaf: true,
              });
            player.twentyFourSeven = true;
            }
            
        ), index * 5000})
};