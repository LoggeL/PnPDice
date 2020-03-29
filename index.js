const Discord = require('discord.js')
const config = require('./config.json')

const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Client logged in as ${client.user.tag}`)
    client.user.setActivity("mit Würfeln")

    client.diceEmojis = []
    const emoteGuild = client.guilds.cache.get(config.emoteGuild)
    if (!emoteGuild) throw Exception('Emoji Guild not found')
    for (let i = 0; i <= 9; i++) {
        const diceEmoji = emoteGuild.emojis.cache.find(emoji => emoji.name === "Dice" + i)
        if (!diceEmoji) throw Exception('Dice Emoji ' + i + ' not found')
        client.diceEmojis.push(diceEmoji)
    }
    client.diceEmojis[10] = emoteGuild.emojis.cache.find(emoji => emoji.name === "DiceRoll")
    if (!client.diceEmojis[10]) throw Exception('Dice Emoji ' + i + ' not found')
})



client.on('message', message => {
    if (message.content.startsWith('ping')) return message.channel.send(`🏓 Pong ${client.ws.ping} ms`)

    if (message.author.bot) return
    if (!message.guild || message.channel.name !== "würfel") return

    const [count, dice] = message.content.split('W')
    console.log(count, dice)
    if (!dice || !Number(count) || !Number(dice)) return message.react('❓')
    if (count > 4) return message.reply('Maximal 4 Würfe auf einmal')
    if (dice > 1000) return message.reply('Maximal Würfel mit 1000 Augen')
    for (let i = 0; i < count; i++) {

    }

    let throws = [`${count}W${dice}`, "⌛ *Die Würfel rollen...* ⌛"]
    let sum = 0
    for (let i = 0; i < count; i++) {
        throws.push(new Array(String(dice - 1).length).fill(client.diceEmojis[10]).join(' '))
    }

    message.channel.send(throws.join('\n')).then(editMessage => {
        setTimeout(() => {
            throws = [`<@${message.author.id}>\n🎲 Die Würfel sind gefallen: 🎲`]
            for (let i = 0; i < count; i++) {
                const roll = Math.floor(Math.random() * dice) + 1
                sum += roll
                const rollStr = ('0'.repeat(dice.length) + roll).slice(String(dice - 1).length * -1)
                console.log(roll, rollStr)
                const dices = String(rollStr).split('')
                throws.push(dices.map(d => client.diceEmojis[d]).join(' '))
            }
            throws.push(`Gesamte Augenzahl: ** ${sum} ** `)
            editMessage.edit(throws.join('\n'))
        }, 1000 + Math.random() * 2000)

    })
})

client.login(config.token)