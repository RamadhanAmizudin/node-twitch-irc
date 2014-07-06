var nt = require('net'),
	rq = require('request'),
	us = require('underscore');

var users = {};
var commands = [];
var channels = [];

/**
 * Main function.
 */
var connect = function(conf, callback) {
	var self = this;
	
	/**
	 * Default configuration.
	 */
	self.config = {
		autoreconnect: conf.autoreconnect || true,
		channels: conf.channels || [],
		server: conf.server || 'irc.twitch.tv',
		port: conf.port || 6667,
		nickname: conf.nickname || 'justinfan'+Math.floor((Math.random() * 80000) + 1000),
		oauth: conf.oauth || 'TWITCH',
		debug: conf.debug || false,
		twitchclient: conf.twitchclient || 3
	};
	
	/**
	 * Connect and send basic informations to the server.
	 */
	_connect(self.config);
	
	/**
	 * Emitted when the server closes.
	 * Note that if connections exist, this event is not emitted until all connections are ended.
	 */
	connect.on('close', function() {
		connect.emit('disconnected', 'Got disconnected from server.');
	});
	
	/**
	 * Emitted when an error occurs. The 'close' event will be called directly following this event.
	 * 
	 * @param Error Object
	 */
	connect.on('error', function(err) {
		connect.emit('disconnected', err.code);
	});
	
	/**
	 * Half-closes the socket. i.e., it sends a FIN packet.
	 * It is possible the server will still send some data.
	 */
	connect.on('end', function() {
		connect.emit('disconnected', 'Client closed connection.');
	});
	
	connect.on("connected", function () {
		connect.write('TWITCHCLIENT '+self.config.twitchclient+'\r\n');
		self.config.channels.forEach(function(channel) {
			if (channel.charAt(0) !== '#') { channel = '#'+channel; }
			connect.write('JOIN '+channel.toLowerCase()+'\r\n');
		});
	});
	
	connect.on("disconnected", function (reason) {
		channels = [];
		if (self.config.autoreconnect) {
			setTimeout( function() { _connect(self.config); }, 5000);
		}
	});
	
	connect.on('join', function(channel, username) {
		if (username === self.config.nickname) {
			channels.push(channel);
		}
	});
	
	connect.on('part', function(channel, username) {
		var array = [2, 5, 9];
		var index = array.indexOf(5);
		
		if (username === self.config.nickname) {
			var index = channels.indexOf(channel);
			if (index > -1) {
				channels.splice(index, 1);
			}
		}
	});
	
	var buffer = '';
	connect.on("data", function (chunk) {
		buffer += chunk;
		var lines = buffer.split("\r\n");
		buffer = lines.pop();
		lines.forEach(function (line) {
			var message = _handleMsg(line, self.config);
			try {
				// Callback - Connected or not ?
				if (message.indexOf('You are in a maze of twisty passages') >= 0) {
					callback(null, connect);
					connect.emit('connected');
				}
				if (message.indexOf('Login unsuccessful') >= 0) {
					callback('Unable to connect to server. Verify your credentials.', connect);
					connect.emit('disconnected', 'Unable to connect to server. Verify your credentials.');
				}
				connect.emit('raw', message);
			} catch (e) {
				throw e;
			}
		});
	});
	
	// Clear the commands queue every 10 seconds.
	setInterval(function(){_clearCommands();},10000);
	
	process.EventEmitter.call(this);
}

/**
 * Connect and send basic informations to the server.
 */
function _connect(config) {
	connect = nt.createConnection(config.port, config.server);
	connect.write('PASS '+config.oauth+'\r\n');
	connect.write('NICK '+config.nickname+'\r\n');
	connect.write('USER '+config.nickname+' 8 * :'+config.nickname+'\r\n');
}

/**
 * Add basic informations about a user.
 */
function _createUser(username) {
	if (!users[username]) {
		users[username] = {
			username: username,
			special: [],
			color: '#696969',
			emote: []
		};
	}
}

/**
 * Handle RAW messages.
 */
function _handleMsg(line, config) {
	if (config.debug) {
		console.log(line);
	}
	// Commands.
	switch(line.split(" ")[0]) {
		case 'PING':
			connect.write('PONG\r\n');
			break;
	}
	
	// Private messages and modes.
	switch(line.split(" ")[1]) {
		case 'PRIVMSG':
			var from = line.split(" ")[0].split("!")[0].replace(':','');
			var channel = line.split(" ")[2];
			var msg = line.substr(line.indexOf(":",2) + 1);
			_createUser(from);
			
			if (from === 'twitchnotify' && msg.indexOf('just subscribed!')) {
				connect.emit('subscribe', channel, msg.split(" ")[0]);
			}
			else if (from === 'jtv') {
				if (msg.split(" ")[0] === 'SPECIALUSER') {
					_createUser(msg.split(" ")[1]);
					var special = users[msg.split(" ")[1]].special;
					if (us.indexOf(special,msg.split(" ")[2]) < 0) { special.push(msg.split(" ")[2]); }
				}
				else if (msg.split(" ")[0] === 'USERCOLOR') {
					_createUser(msg.split(" ")[1]);
					users[msg.split(" ")[1]].color = msg.split(" ")[2];
				}
				else if (msg.split(" ")[0] === 'EMOTESET') {
					_createUser(msg.split(" ")[1]);
					users[msg.split(" ")[1]].emote = msg.split(" ")[2];
				}
				else if (msg.split(" ")[0] === 'CLEARCHAT') {
					if (msg.split(" ")[1]) {
						connect.emit('timeout', channel, msg.split(" ")[1]);
					} else {
						connect.emit('clearchat', channel);
					}
				}
				else if (msg === 'This room is now in subscribers-only mode.') { connect.emit('submode', channel, true); }
				else if (msg === 'This room is no longer in subscribers-only mode.') { connect.emit('submode', channel, false); }
				else if (msg.indexOf('This room is now in slow mode. You may send messages every') === 0) { connect.emit('slowmode', channel, true); }
				else if (msg === 'This room is no longer in slow mode.') { connect.emit('slowmode', channel, false); }
				else if (msg.indexOf('This room is now in r9k mode.') === 0) { connect.emit('r9kmode', channel, true); }
				else if (msg === 'This room is no longer in r9k mode.') { connect.emit('r9kmode', channel, false); }
				else if (msg.indexOf('The moderators of this room are') === 0) {
					var mods = msg.substr(msg.indexOf(":",2) + 2);
					connect.emit('mods', channel, mods);
				}
			}
			else {
				if (msg.split(" ")[0] === '\u0001ACTION') {
					connect.emit('action', users[from], channel, msg.replace('\u0001ACTION ', '').replace('\u0001', ''));
				} else {
					connect.emit('chat', users[from], channel, msg);
				}
			}
			break;
		case 'MODE':
			var channel = line.split(" ")[2];
			var mode = line.split(" ")[3];
			var username = line.split(" ")[4];
			
			connect.emit('mode', channel, mode, username);
			break;
		case 'JOIN':
			var channel = line.split(" ")[2];
			var username = line.split(" ")[0].split("!")[0].replace(':','');
			
			connect.emit('join', channel, username);
			break;
		case 'PART':
			var channel = line.split(" ")[2];
			var username = line.split(" ")[0].split("!")[0].replace(':','');
			
			connect.emit('part', channel, username);
			break;
		case '353':
			var channel = line.split(" ")[4];
			var names = line.substr(line.indexOf(":",2) + 1);
			if (config.twitchclient === 1) {
				connect.emit('names', channel, names);
			}
			break;
	}
	
	return line;
}

/**
 * Clear the commands queue.
 */
function _clearCommands() {
	var currentTime = new Date().getTime() / 1000;
	var scope = currentTime - 30;
	var count = 0;
	
	for (var i = commands.length; i >= 0 ; i--) {
		if (commands[i] < scope) {
			commands.splice(i, 1);
		}
	}
}

/**
 * Commands..
 */
connect.prototype.action = function(channel, message) {
	if (channel.charAt(0) !== '#') { channel = '#'+channel; }
	if (channels.indexOf(channel) >= 0) {
		connect.write('PRIVMSG '+channel.toLowerCase()+' :/me '+message+'\r\n');
		commands.push(new Date().getTime() / 1000);
	} else { console.log('Cannot send action message to '+channel+'. The bot isn\'t on the channel.'); }
}

connect.prototype.join = function(channel) {
	if (channel.charAt(0) !== '#') { channel = '#'+channel; }
	
	connect.write('JOIN '+channel.toLowerCase()+'\r\n');
}

connect.prototype.mods = function(channel) {
	if (channel.charAt(0) !== '#') { channel = '#'+channel; }
	
	if (channels.indexOf(channel) >= 0) {
		connect.write('PRIVMSG '+channel.toLowerCase()+' :/mods\r\n');
		commands.push(new Date().getTime() / 1000);
	} else { console.log('Cannot retrieve mods from '+channel+'. The bot isn\'t on the channel.'); }
}

connect.prototype.part = function(channel) {
	if (channel.charAt(0) !== '#') { channel = '#'+channel; }
	
	connect.write('PART '+channel.toLowerCase()+'\r\n');
}

connect.prototype.say = function(channel, message) {
	if (channel.charAt(0) !== '#') { channel = '#'+channel; }
	
	if (channels.indexOf(channel) >= 0) {
		connect.write('PRIVMSG '+channel.toLowerCase()+' :'+message+'\r\n');
		commands.push(new Date().getTime() / 1000);
	} else { console.log('Cannot send message to '+channel+'. The bot isn\'t on the channel.'); }
}

connect.prototype.send = function(channel, command) {
	if (channel.charAt(0) !== '#') { channel = '#'+channel; }
	if (command.charAt(0) !== '/') { command = '/'+command; }
	
	if (channels.indexOf(channel) >= 0) {
		connect.write('PRIVMSG '+channel.toLowerCase()+' :'+command+'\r\n');
		commands.push(new Date().getTime() / 1000);
	} else { console.log('Cannot send command to '+channel+'. The bot isn\'t on the channel.'); }
}

connect.prototype.commandCount = function() {
	var currentTime = new Date().getTime() / 1000;
	var scope = currentTime - 30;
	var count = 0;
	
	for (var i = 0; i < commands.length; i++) {
		if (commands[i] >= scope) {
			count++;
		}
	}
	
	return count;
}

exports.connect = connect;