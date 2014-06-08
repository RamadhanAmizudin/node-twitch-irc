/**
 * This is an example of how to use node-twitch-irc.
 * 
 * In this example, the bot will listen for the commands:
 *  - !hello
 *  - !join #channel
 *  - !part #channel
 * 
 * You will need to create an account for your bot and retrieve the
 * oauth password (http://twitchapps.com/tmi/).
 */

var irc = require('node-twitch-irc');

var config = {
	nickname: 'bot_username',
	channels: ['#list','#of','#channels'],
	oauth: 'oauth:your_oauth_password'
};

var client = new irc.connect(config, function(err, event) {
	if (!err) {
		// "Chat" event.
		event.on("chat", function (from, to, message) {
			console.log('['+to+'] <'+from.color+'|'+from.username+'|'+from.special+'> '+message);
			
			// Command: !hello
			if (message === '!hello') {
				// Greets the user on the channel.
				client.say(to, 'Hello, '+from.username+'!');
			}
			
			// Command: !join #channel
			else if (message.startsWith('!join ')) {
				// Get the channel name..
				var channel = message.split(" ")[1];
				
				// Make sure the user specified a channel to join..
				if (typeof channel !== 'undefined' && channel.trim() !== '') {
					client.join(channel);
					client.say(to, 'Joined '+channel);
				} else {
					client.say(to, 'Insufficient arguments. Type !join #channel');
				}
			}
			
			// Command: !part #channel
			else if (message.startsWith('!part ')) {
				// Get the channel name..
				var channel = message.split(" ")[1];
				
				// Make sure the user specified a channel to join..
				if (typeof channel !== 'undefined' && channel.trim() !== '') {
					client.part(channel);
					client.say(to, 'Left '+channel);
				} else {
					client.say(to, 'Insufficient arguments. Type !part #channel');
				}
			}
		});
		
		// "Connected" event.
		event.on("connected", function () {
			console.log('CONNECTED');
		});
		
		// "Disconnected" event.
		event.on("disconnected", function (reason) {
			console.log('DISCONNECTED: '+reason);
		});
		
		// "Join" event.
		event.on("join", function (channel) {
			console.log('JOINED: '+channel);
		});
	}
	else  {
		console.log(err);
	}
});