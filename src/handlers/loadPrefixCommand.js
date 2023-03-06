const chillout = require("chillout");
const readdirRecursive = require("recursive-readdir");
const { resolve, relative } = require("path");

module.exports = async (client) => {
    let interactionsPath = resolve("./src/commands/prefix");
    let interactionFiles = await readdirRecursive(interactionsPath);

    await chillout.forEach(interactionFiles, (interactionFile) => {
        const start = Date.now();
        const rltPath = relative(__dirname, interactionFile);
        const command = require(interactionFile);

        if (!command.name?.length) {
            client.logger.warn(`"${rltPath}" The prefix command file does not have a name. Skipping..`);
            return;
        }

        if (client.commands.has(command.name)) {
            client.logger.warn(`"${command.name}" prefix command has already been installed. It's skipping.`)
            return;
        }

        client.commands.set(command.name, command);

        if (command.aliases && command.aliases.length !== 0)
            command.aliases.forEach(a => client.aliases.set(a, command.name)) 

     //   console.log(`[INFO] "${command.type == "CHAT_INPUT" ? `/${command.name.join(" ")}` : `${command.name[0]}`}" ${command.name[1] || ""}  ${command.name[2] || ""} The interaction has been uploaded. (it took ${Date.now() - start}ms)`);
        });
        if (client.commands.size) {
            client.logger.info(`${client.commands.size} Prefix Command Loaded!`);
        } else {
            client.logger.warn(`No prefix command loaded, is everything ok?`);
        }
}