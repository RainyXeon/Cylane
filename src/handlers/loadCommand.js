module.exports = (client) => {
    require("./Command/loadFiles.js")(client);
    require("./Command/autoDeploy.js")(client)
};