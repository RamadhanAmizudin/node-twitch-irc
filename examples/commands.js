/**
 * This is an example of how to use node-twitch-irc.
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
		event.on("chat", function (user, channel, message) {
			var msg = message.toLowerCase();
			var args = msg.split(" ");
			
			if (msg === '!hello') {
				client.say(channel, 'Hello, '+user.username+'!');
			}
			
			else if (msg === '!action') {
				client.action(channel, 'Hello, '+user.username+'!');
			}
			
			else if (msg.indexOf('!join ') === 0) {
				if (typeof args[1] !== 'undefined' && args[1].trim() !== '') {
					client.join(args[1]);
				} else {
					client.say(channel, 'Insufficient arguments. Type !join #channel');
				}
			}
			
			else if (msg.indexOf('!part ') === 0) {
				if (typeof args[1] !== 'undefined' && args[1].trim() !== '') {
					client.part(args[1]);
				} else {
					client.say(channel, 'Insufficient arguments. Type !part #channel');
				}
			}
		});
	}
	else  {
		console.log(err);
	}
});