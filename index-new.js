/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, no-console */

// Require the TwitchJS library.
const Twitch = require('twitch-bot')
const Discord = require('discord.js')

const Bot = new Twitch({
	username: 'mittalyashu',
	oauth: 'oauth:ub1xduq00ryq4lhtm6fu2uk4odq05y',
	channels: ['mittalyashu']
})

// Bot.on('join', () => {
// 	console.log(`Joined channel: ${channels}`)
// })

Bot.on('error', err => {
	console.log(err)
})

const discordClient = new Discord.Client()

discordClient.login(
	'NDk0NTc2MDIwMzk4Mjc2NjI4.DpFNQg.UUgbm7z5KBIYIVti7dQQc3PM8jQ'
)

discordClient.on('ready', () => {
	discordClient.user.setActivity('Monitoring Twitch chats')
	console.log(`Currently listening to ${discordClient.guilds.size} servers`)
})

function sendMessageOnDiscord(chatter) {
	discordClient.channels.get('495914303908741121').send({
		embed: {
			color: chatter['color'] == null ? 0x549469 : 0x5823d8,
			author: {
				name: chatter['display_name']
				// icon_url: userstate['id']
			},
			description: chatter.message,
			footer: {
				text: new Date()
			}
		}
	})
}

Bot.on('message', chatter => {
	console.log(chatter)
	sendMessageOnDiscord(chatter)
})

// Bot.on('join', () => {

// 	Bot.on('message', chatter => {
// 		if (chatter.message === '!test') {
// 			Bot.say('Command executed! PogChamp')
// 		}
// 	})

// })
