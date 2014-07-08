/**
 * You will need to create an account for your bot and retrieve the
 * oauth password (http://twitchapps.com/tmi/).
 */

var irc = require('node-twitch-irc');

var config = {
	nickname: 'bot_username',
	channels: ['#list','#of','#channels'],
	oauth: 'oauth:your_oauth_token',
	names: true // Set the 'names' option to true (Default: false) to listen for 'names' event (See below).
};

var client = new irc.connect(config, function(err, event) {
	if (!err) {
		// "Action" event.
		event.on("action", function (user, channel, message) {
			console.log('[[ACTION]'+channel+']] <'+user.color+'|'+user.username+'|'+user.special+'> '+message);
		});
		
		// "Chat" event.
		event.on("chat", function (user, channel, message) {
			console.log('['+channel+'] <'+user.color+'|'+user.username+'|'+user.special+'> '+message);
		});
		
		// "Clearchat" event.
		event.on("clearchat", function (channel) {
			console.log('['+channel+'] CHAT CLEARED.');
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
			console.log(username+' joined '+channel);
		});
		
		// "Mode" event.
		event.on("mode", function (channel, mode, username) {
			console.log('MODE: '+channel+' '+mode+' '+username);
		});
		
		// "Mods" event.
		event.on("mods", function (channel, mods) {
			console.log('MODS OF '+channel+': '+mods);
		});
		
		// "Names" event. (twitchclient 1 is required)
		event.on("names", function (channel, names) {
			console.log('Channel names of '+channel+': '+names);
		});
		
		// "Part" event.
		event.on("part", function (channel, username) {
			console.log(username+' left '+channel);
		});
		
		// "R9Kmode" event.
		event.on("r9kmode", function (channel, value) {
			console.log('Changed R9K mode on '+channel+' to '+value);
		});
		
		// "Raw" event.
		event.on("raw", function (msg) {
			console.log('RAW: '+msg);
		});
		
		// "Slowmode" event.
		event.on("slowmode", function (channel, value) {
			console.log('Changed slow mode on '+channel+' to '+value);
		});
		
		// "Submode" event.
		event.on("submode", function (channel, value) {
			console.log('Changed subscribers-only mode on '+channel+' to '+value);
		});
		
		// "Subscribe" event.
		event.on("subscribe", function (channel, username, resub) {
			if (!resub) { console.log('NEW SUBSCRIBER: ' + username + ' just subscribed on '+channel); }
			else { console.log('RESUB: ' + username + ' just re-subscribed on '+channel); }
		});
		
		// "Timeout" event.
		event.on("timeout", function (channel, username) {
			console.log(username+' has been timed out on '+channel+'.');
		});
	}
	else  {
		console.log(err);
	}
});