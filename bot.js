const { Client, Intents, MessageAttachment, MessageEmbed  } = require("discord.js");
require("dotenv").config({path: __dirname + "/.env"});
var list = require('./file/list.json')
const fs = require('fs')

const client = new Client({
    disableEveryone: true,
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on("messageCreate", async message => {
    if (message.author.bot) return;

    if (message.content.startsWith('^')) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return;
    }

    if (message.content.startsWith('^help')) {
        return await message.reply("^help, ^report, ^remove, ^list")
    }

    if (message.content.startsWith('^report')) {
        const args = message.content.slice().trim().split(/ +/g);
        const report = args[1]
        if (list.includes(report)) {
            return await message.reply(`Cette réponse de fdp est déjà enregistrée`)
        } else {
            list.push(report);
            fs.writeFile('./file/list.json', JSON.stringify(list), () => {
                return message.reply(`${report} à été ajouté dans la liste des réponses de fdp`)
            });
        }
    }

    if(message.content.startsWith('^remove')) {
        const args = message.content.slice().trim().split(/ +/g);
        const report = args[1]
        if (!list.includes(report)) {
            return await message.reply(`Cette réponse de fdp n'est pas dans la liste`)
        } else {
            list = list.filter(elt => elt != report)
            fs.writeFile('./file/list.json', JSON.stringify(list), () => {
                return message.reply(`${report} à été retiré de la liste des réponses de fdp`)
            });
        }
    }

    if(message.content.startsWith('^list')) {
        return await message.reply(`Voici la liste des réponses de fdp :\n${list}`)
    }

    const regexList = list.map(elt => new RegExp(`^${elt.split("").join('+\\s*')}+$`))
    if (regexList.some(rx => rx.test(message.content.toLowerCase().trim()))) {
        if (message.content.toLowerCase().trim() == "feur") {
            if (!Math.floor(Math.random() * 10)) {
                const embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setImage(`https://pbs.twimg.com/media/E2LKKL7XMAIvAX1.jpg`)
                return await message.reply({embeds: [embed]});
            }
        }
        return message.delete();
    }
})

client.login(process.env.TOKEN);
