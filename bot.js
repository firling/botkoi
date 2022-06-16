const { Client, Intents  } = require("discord.js");
require("dotenv").config({path: __dirname + "/.env"});

const client = new Client({
    disableEveryone: true,
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on("messageCreate", async message => {
    // console.log(`${message.author.username} said: ${message.content}`);

    const list = [
        'feur', 'feuse', 'fage'
    ]

    if (list.includes(message.content)) {
        message.delete();
    }
})

client.login(process.env.TOKEN);
