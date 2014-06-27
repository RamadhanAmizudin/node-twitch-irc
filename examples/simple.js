/**
 * You will need to create an account for your bot and retrieve the
 * oauth password (http://twitchapps.com/tmi/).
 */

var irc = require('node-twitch-irc');

var config = {
	nickname: 'bot_username',
	channels: ['#list','#of','#channels'],
	oauth: 'oauth:your_oauth_token'
};

var client = new irc.connect(config, function(err, event) {
	if (!err) {
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
		
		// "Chat" event.
		event.on("chat", function (from, to, message) {
			console.log('['+to+'] <'+from.color+'|'+from.username+'|'+from.special+'> '+message);
		});
	}
	else  {
		console.log(err);
	}
});