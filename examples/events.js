/**
 * This is an example of how to use node-twitch-irc.
 * 
 * In this example, we will listen for each and every events available.
 * 
 * You will need to create an account for your bot and retrieve the
 * oauth password (http://twitchapps.com/tmi/).
 */

var irc = require('node-twitch-irc');

var config = {
	nickname: 'bot_username',
	channels: ['#list','#of','#channels'],
	oauth: 'oauth:your_oauth_password',
	names: true // Set the 'names' option to true (Default: false) to listen for 'names' event (See below).
};

var client = new irc.connect(config, function(err, event) {
	if (!err) {
		// "Raw" event.
		event.on("raw", function (msg) {
			console.log('RAW: '+msg);
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
		
		// "Chat" event.
		event.on("chat", function (from, to, message) {
			console.log('['+to+'] <'+from.color+'|'+from.username+'|'+from.special+'> '+message);
		});
		
		// "Action" event.
		event.on("action", function (from, to, message) {
			console.log('[[ACTION]'+to+']] <'+from.color+'|'+from.username+'|'+from.special+'> '+message);
		});
		
		// "Mode" event.
		event.on("mode", function (channel, mode, username) {
			console.log('MODE: '+channel+' '+mode+' '+username);
		});
		
		// "Subscribe" event.
		event.on("subscribe", function (channel, username) {
			console.log('NEW SUBSCRIBER: ' + username + ' just subscribed on '+channel);
		});
		
		// "Timeout" event.
		event.on("timeout", function (channel, username) {
			console.log(username+' has been timed out on '+channel+'.');
		});
		
		// "Clearchat" event.
		event.on("clearchat", function (channel) {
			console.log('['+channel+'] CHAT CLEARED.');
		});
		
		// "Names" event. ('names' option must be set to true!)
		
		// When the bot joins a channel, it will retrieve all the active moderators,
		// staffs, admins and viewers as an object.
		
		// The event will NOT be fired if the Twitch API is not responding.
		event.on("names", function (channel, names) {
			//console.log(names);
		});
	}
	else  {
		console.log(err);
	}
});