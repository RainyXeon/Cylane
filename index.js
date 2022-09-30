const MainClient = require("./manager.js");
const client = new MainClient();

client.connect()
client.on('error', error => {
    console.log(error)
})
module.exports = client; 