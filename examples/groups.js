/**
 * This is an example of how to use node-twitch-irc.
 * 
 * In this example, we will connect to a Twitch IRC server and join a group channel.
 * 
 * You will need to create an account for your bot and retrieve the
 * oauth password (http://twitchapps.com/tmi/).
 * 
 * Retrieve the IRC servers and group channels with
 * https://chatdepot.twitch.tv/room_memberships?oauth_token=YOUR_TOKEN
 */

var irc = require('node-twitch-irc');

var config = {
	nickname: 'bot_username',
	channels: ['#_group_channel'],
	server: '199.9.248.248',
	port: 80,
	oauth: 'oauth:your_oauth_password'
};

var client = new irc.connect(config, function(err, event) {
	if (!err) {
		// "Chat" event.
		event.on("chat", function (user, channel, message) {
			console.log('['+channel+'] <'+user.color+'|'+user.username+'|'+user.special+'> '+message);
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
		
		// "Submode" event.
		event.on("submode", function (channel, value) {
			console.log('Changed subscribers-only mode on '+channel+' to '+value);
		});
	}
	else  {
		console.log(err);
	}
});