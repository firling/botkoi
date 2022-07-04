const { Client, Intents, MessageAttachment, MessageEmbed, Permissions  } = require("discord.js");
require("dotenv").config({path: __dirname + "/.env"});
var list = require('./file/list.json')
const fs = require('fs')

const client = new Client({
    disableEveryone: true,
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

function removeFirstWord(str) {
    const indexOfSpace = str.indexOf(' ');

    if (indexOfSpace === -1) {
    return '';
    }

    return str.substring(indexOfSpace + 1);
}

function removeLastWord(str) {
    const lastIndexOfSpace = str.lastIndexOf(' ');
  
    if (lastIndexOfSpace === -1) {
      return str;
    }
  
    return str.substring(0, lastIndexOfSpace);
  }

function checkFeur(str){
    var strr = str

    while(str != ''){
        while(strr != '')
        if(/f[^a-zA-Z]*e[^a-zA-Z]*u[^a-zA-Z]*r[^a-zA-Z]*$/.test(str)){
            return true
        }
        else{
            removeLastWord(str)
        }
        strr = removeFirstWord(str)
    }
    return false
}

client.on("messageCreate", async message => {
    console.log(message.content)
    if (message.author.bot) return;

    if (message.content.startsWith('^')) {
        if (!message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES])) return;
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
        if (checkFeur(message.content.toLowerCase().trim())) {
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
