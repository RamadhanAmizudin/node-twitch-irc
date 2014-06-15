var nt = require('net'),
	rq = require('request'),
	us = require('underscore');

var users = {};

if (typeof String.prototype.startsWith !== 'function') {
	String.prototype.startsWith = function (str){
		return this.indexOf(str) === 0;
	};
}

/**
 * Main function.
 */
var connect = function(conf, callback) {
	var self = this;
	var err = {
		code: 0,
		message: '',
		details: ''
	};
	
	/**
	 * Default configuration.
	 */
	self.config = {
		autoreconnect: true,
		channels: [],
		names: false,
		server: 'irc.twitch.tv',
		port: 6667,
		nickname: 'justinfan'+Math.floor((Math.random() * 80000) + 1000),
		oauth: '',
		debug: false
	};
	
	/**
	 * Custom configuration.
	 */
	if (conf && us.isObject(conf)) {
		if (conf.autoreconnect && us.isBoolean(conf.autoreconnect)) { self.config.autoreconnect = conf.autoreconnect; }
		if (conf.channels && us.isArray(conf.channels)) { self.config.channels = conf.channels; }
		if (conf.names && us.isBoolean(conf.names)) { self.config.names = conf.names; }
		if (conf.server && us.isString(conf.server)) { self.config.server = conf.server; }
		if (conf.port && us.isNumber(conf.port)) { self.config.port = conf.port; }
		if (conf.nickname && us.isString(conf.nickname)) { self.config.nickname = conf.nickname; }
		if (conf.oauth && us.isString(conf.oauth)) { self.config.oauth = conf.oauth; }
		if (conf.debug && us.isBoolean(conf.debug)) { self.config.debug = conf.debug; }
	}
	
	/**
	 * Connect and send basic informations to the server.
	 */
	_connect(self.config);
	
	/**
	 * Emitted when the server has been bound after calling server.listen.
	 */
	connect.on('listening', function() {
		//
	});
	
	/**
	 * Emitted when a new connection is made. socket is an instance of net.Socket.
	 * 
	 * @param Socket object The connection object
	 */
	connect.on('connection', function(socket) {
		//
	});
	
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
		connect.write('TWITCHCLIENT 3\r\n');
		self.config.channels.forEach(function(channel) {
			if (channel.charAt(0) !== '#') { channel = '#'+channel; }
			connect.write('JOIN '+channel.toLowerCase()+'\r\n');
		});
	});
	
	connect.on("disconnected", function (reason) {
		connected = false;
		if (self.config.autoreconnect) {
			setTimeout( function() { _connect(self.config); }, 5000);
		}
	});
	
	connect.on("join", function (channel) {
		if (self.config.names) {
			_chatters(channel, function(err, result) {
				if (!err) {
					var names = result.chatters;
					connect.emit('names', channel, names);
				}
			});
		}
	});
	
	var buffer = '';
	connect.on("data", function (chunk) {
		buffer += chunk;
		var lines = buffer.split("\r\n");
		buffer = lines.pop();
		lines.forEach(function (line) {
			var message = _handleMsg(line, self.config.debug);
			try {
				// Callback - Connected or not ?
				if (message.indexOf('You are in a maze of twisty passages') >= 0) {
					callback(null, connect);
					connected = true;
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
	
	process.EventEmitter.call(this);
}

/**
 * Connect and send basic informations to the server.
 */
function _connect(config) {
	connect = nt.createConnection(config.port, config.server);
	if (config.oauth !== '') { connect.write('PASS '+config.oauth+'\r\n'); }
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
function _handleMsg(line, debug) {
	if (debug) {
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
			var to = line.split(" ")[2];
			var msg = line.substr(line.indexOf(":",2) + 1);
			_createUser(from);
			
			if (from === 'twitchnotify' && msg.indexOf('just subscribed!')) {
				connect.emit('subscribe', to, msg.split(" ")[0]);
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
						connect.emit('timeout', to, msg.split(" ")[1]);
					} else {
						connect.emit('clearchat', to);
					}
				}
				else if (msg === 'This room is now in subscribers-only mode.') { connect.emit('submode', to, true); }
				else if (msg === 'This room is no longer in subscribers-only mode.') { connect.emit('submode', to, false); }
				else if (msg.indexOf('This room is now in slow mode. You may send messages every') === 0) { connect.emit('slowmode', to, true); }
				else if (msg === 'This room is no longer in slow mode.') { connect.emit('slowmode', to, false); }
				else if (msg.indexOf('This room is now in r9k mode.') === 0) { connect.emit('r9kmode', to, true); }
				else if (msg === 'This room is no longer in r9k mode.') { connect.emit('r9kmode', to, false); }
			}
			else {
				if (msg.split(" ")[0] === '\u0001ACTION') {
					connect.emit('action', users[from], to, msg.replace('\u0001ACTION ', '').replace('\u0001', ''));
				} else {
					connect.emit('chat', users[from], to, msg);
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
			
			connect.emit('join', channel);
			break;
		case 'PART':
			var channel = line.split(" ")[2];
			
			connect.emit('part', channel);
			break;
	}
	
	return line;
}

/**
 * Returns a list of all users connected on a channel.
 * 
 * e.g: http://tmi.twitch.tv/group/user/lirik/chatters
 */
function _chatters(channel, cb) {
	rq('http://tmi.twitch.tv/group/user/'+channel.replace('#','').toLowerCase()+'/chatters', function (error, response, body) {
		var codes = [500,501,502,503,504,505];
		if (!error && response.statusCode === 200 && us.indexOf(codes, response.statusCode) === -1) {
			cb(null, JSON.parse(body));
		} else { cb(response.statusCode, null); }
	});
}

/**
 * Commands..
 */
connect.prototype.action = function(channel, message) {
	if (channel.charAt(0) !== '#') { channel = '#'+channel; }
	connect.write('PRIVMSG '+channel.toLowerCase()+' :/me '+message+'\r\n');
}

connect.prototype.join = function(channel) {
	if (channel.charAt(0) !== '#') { channel = '#'+channel; }
	
	connect.write('JOIN '+channel.toLowerCase()+'\r\n');
}

connect.prototype.part = function(channel) {
	if (channel.charAt(0) !== '#') { channel = '#'+channel; }
	
	connect.write('PART '+channel.toLowerCase()+'\r\n');
}

connect.prototype.say = function(channel, message) {
	if (channel.charAt(0) !== '#') { channel = '#'+channel; }
	
	connect.write('PRIVMSG '+channel.toLowerCase()+' :'+message+'\r\n');
}

connect.prototype.send = function(channel, command) {
	if (channel.charAt(0) !== '#') { channel = '#'+channel; }
	if (command.charAt(0) !== '/') { command = '/'+command; }
	
	connect.write('PRIVMSG '+channel.toLowerCase()+' :'+command+'\r\n');
}

exports.connect = connect;