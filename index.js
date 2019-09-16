/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, no-console */

// Require the TwitchJS library.
const TwitchJS = require('twitch-js')
const Discord = require('discord.js')
const Moment = require('moment')

const options = {
	connection: {
		reconnect: true,
		secure: true
	},
	options: {
		// Some methods may require a client ID. If needed, please provide a
		// client ID below.
		clientId: 's1x9qoax4an48m0h0r49c8hogf76s8',
		debug: true
	},
	// Some methods may require an identity. If needed, please provide one
	// here. Prepend your token with "oauth:".
	identity: {
		username: 'chat-relay',
		password: 'oauth:ub1xduq00ryq4lhtm6fu2uk4odq05y'
	},
	channels: ['#mittalyashu']
}

const twitchClient = new TwitchJS.Client(options)
const discordClient = new Discord.Client()

discordClient.login(
	'NDk0NTc2MDIwMzk4Mjc2NjI4.DpFNQg.UUgbm7z5KBIYIVti7dQQc3PM8jQ'
)

discordClient.on('ready', () => {
	discordClient.user.setActivity('Monitoring Twitch & Discord chat')
	console.log(`Currently listening to ${discordClient.guilds.size} servers`)
})

// Sending the message to discord
function sendMessageOnDiscord(message, userstate) {
	let color = typeof message['color'] === 'null' ? message['color'] : 3447003
	let badges = Object.keys(message['badges']).join(', ')
	discordClient.channels.get('495914303908741121').send({
		embed: {
			color: `${color}`,
			author: {
				name: `${message['display-name']}`,
				icon_url:
					'https://static-cdn.jtvnw.net/jtv_user_pictures/twitch-profile_image-8a8c5be2e3b64a9a-300x300.png',
				url: `https://twitch.tv/${message['username']}`
			},
			description: `${userstate}`,
			fields: [
				{
					name: 'Badges 📛',
					value: `${badges}`,
					inline: true
				},
				{
					name: 'Moderator ⚔',
					value: message['mod'] == true ? 'Yes' : 'No',
					inline: true
				},
				{
					name: 'Subscriber 🌟',
					value: message['subscriber'] == true ? 'Yes' : 'No',
					inline: true
				},
				{
					name: 'Turbo 🤖',
					value: message['turbo'] == true ? 'Yes' : 'No',
					inline: true
				}
			],
			footer: {
				text: Moment().format('MMMM Do YYYY, h:mm:ssa')
			}
		}
	})
}

// Watching twitch chat
twitchClient.on('chat', (channel, message, userstate, self) => {
	if (self) return
	// Sending twitch chat to discord
	sendMessageOnDiscord(message, userstate)
})

// Send messages to twitch
discordClient.on('message', message => {
	if (message.author.bot) return
	else twitchClient.say('mittalyashu', `${message.author.username}: ${message.content}`)
})

// Finally, connect to the channel
twitchClient.connect()
