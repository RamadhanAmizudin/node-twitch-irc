/**
 * This is an example of how to use node-twitch-irc.
 * 
 * Will send greeting to mods. I recommend using a list of mods in your code. The other way would
 * be to listen to the MODE event, but Twitch IRC servers are very slow.
 * 
 * You will need to create an account for your bot and retrieve the
 * oauth password (http://twitchapps.com/tmi/).
 */

var irc = require('node-twitch-irc'),
	_ = require('underscore'); // Don't forget to add underscore in your dependencies.

var config = {
	nickname: 'bot_username',
	channels: ['#list','#of','#channels'],
	oauth: 'oauth:your_oauth_token',
	twitchclient: 1
};

// List of mods in your channel.
var mods = ['username1','username2','username3','username4']

var client = new irc.connect(config, function(err, event) {
	if (!err) {
		// "Chat" event.
		event.on("chat", function (from, to, message) {
			var msg = message.toLowerCase();
			var args = msg.split(" ");
			
			console.log('['+to+'] <'+from.color+'|'+from.username+'|'+from.special+'> '+message);
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
		event.on("join", function (channel, username) {
			console.log(username+' JOINED '+channel);
			
			// username is in 'mods'
			if (_.indexOf(mods, username) >= 0) {
				client.say(channel, 'Welcome, '+username+'!');
			}
		});
	}
	else  {
		console.log(err);
	}
});