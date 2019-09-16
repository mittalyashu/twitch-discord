const TwitchJS = require('twitch-js')
const Discord = require('discord.js')
const mysql = require('mysql')
const dClient = new Discord.Client()
const options = {
  connection: {
      reconnect: true,
      secure: true,
  },
  options: {
      clientId: '',
  },
  identity: {
      username: 'relay_discord',
      password: 'oauth:',
  },
  channels: [],
};
 
const data = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'twitch'
})
 
 data.query(`SELECT * from channels`, (err, row) => {
   row.forEach(rows => {
     options.channels.push(rows.twitch);
  })
  console.log(options.channels)
})
 
const client = new TwitchJS.Client(options);
 
dClient.on('message', msg => {
    data.query(`SELECT * from channels WHERE server = ${msg.guild.id}`, (err, row) => {
        if (row && row.length) {
            if (row[0].channelID !== "0") {
                if (msg.channel.id === row[0].channelID) {
                    if (msg.author.bot) return;
                    client.say(`${row[0].twitch}`, msg.author.username + "#" +  msg.author.discriminator + ": " + msg.content)
                }
            }
        }
    })
    if (msg.content.startsWith("!count")) {
        msg.reply("Discord Relay currently monitor " + options.channels.length + " streams!")
    }
})
 
client.on('chat', (channel, userstate, message, self) => {
    console.log(userstate['room-id'])
    data.query(`SELECT * from channels WHERE roomid = ${userstate['room-id']}`, (err, row) => {
        if (row && row.length) {
            if (row[0].channelID !== "0") {
                let role;
                switch (true) {
                  case (userstate['subscriber']):
                  role = "{Sub} "
                  break;
                  case  (userstate['mod']):
                  role = "{Mod} "
                  break;
                  case (userstate['turbo']):
                  role = "{Turbo} "
                  break;
                  default:
                  role = "{Viewer} "
                }
                if (self) return;
                if (userstate['display-name'] === "Nightbot") return;
                dClient.channels.get(row[0].channelID).send({
                    embed: {
                        color: 3447003,
                        fields: [{
                            name: `${role + userstate['display-name']}`,
                            value: `${message}`
                        }, ],
                        timestamp: new Date(),
                    }
                })
            } else {
                let role;
                switch (true) {
                  case (userstate['subscriber']):
                  role = "{Sub} "
                  break;
                  case  (userstate['mod']):
                  role = "{Mod} "
                  break;
                  case (userstate['turbo']):
                  role = "{Turbo} "
                  break;
                  default:
                  role = "{Viewer} "
                }
                if (self) return;
                if (userstate['display-name'] === "Nightbot") return;
                dClient.channels.find('name', 'general').send({
                    embed: {
                        color: 3447003,
                        fields: [{
                            name: `${role + userstate['display-name']}`,
                            value: `${message}`
                        }, ],
                        timestamp: new Date(),
                    }
                })
            }
        }
    })
})
 
client.connect();
dClient.login('')