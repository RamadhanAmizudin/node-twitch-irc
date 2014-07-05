# node-twitch-irc

Node.js module allowing you to connect to Twitch and handle multiple events asynchronously.

![](https://nodei.co/npm/node-twitch-irc.png?downloads=true&stars=true)

![](https://david-dm.org/Schmoopiie/node-twitch-irc.png)

### Changelogs

**v1.1.1**:

- [ADDED] [commandCount()](https://github.com/Schmoopiie/node-twitch-irc/wiki/Function-commandCount()) function to check how many messages were sent within the last 30 seconds.
- [ADDED] Send a request to the server to get a list of mods of a channel using the [mods command](https://github.com/Schmoopiie/node-twitch-irc/wiki/Command-mods).
- [ADDED] [Mods event](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-mods) to retrieve the list of mods of a channel.
- [CHANGED] [Part event](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-part) to include the username param.
- [CHANGED] [Names event](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-names) is now triggered if you set [twitchclient 1](https://github.com/Schmoopiie/node-twitch-irc/wiki/Configuration).
- [FIXED] Prevent commands from being sent if the bot isn't on the channel.
- [REMOVED] You are no longer required to set names to true in your configuration.
- [UPDATED] [Examples](https://github.com/Schmoopiie/node-twitch-irc/tree/master/examples) updated with the last changes.

**v1.1.0**:

- [ADDED] [twitchclient](https://github.com/Schmoopiie/node-twitch-irc/wiki/Configuration) setting.

### Installation

1- You will need [node.js](http://nodejs.org/) and [npm](https://npmjs.org/). Joyent has
an [excellent blog post on how to get those installed](http://joyent.com/blog/installing-node-and-npm), so we'll omit those details here.

2- Install node-twitch-irc via NPM:
```
npm install node-twitch-irc
```
3- Check out the [examples on GitHub](https://github.com/Schmoopiie/node-twitch-irc/tree/master/examples) of how to use node-twitch-irc.

4- Check out the [wiki](https://github.com/Schmoopiie/node-twitch-irc/wiki/Configuration). It's worth it.

### Events

- [action](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-action)
- [chat](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-chat)
- [clearchat](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-clearchat)
- [connected](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-connected)
- [disconnected](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-disconnected)
- [join](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-join)
- [mode](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-mode)
- [names](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-names)
- [part](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-part)
- [r9kmode](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-r9kmode)
- [raw](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-raw)
- [slowmode](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-slowmode)
- [submode](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-submode)
- [subscribe](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-subscribe)
- [timeout](https://github.com/Schmoopiie/node-twitch-irc/wiki/Event-timeout)

### Commands

- [action](https://github.com/Schmoopiie/node-twitch-irc/wiki/Command-action)
- [join](https://github.com/Schmoopiie/node-twitch-irc/wiki/Command-join)
- [part](https://github.com/Schmoopiie/node-twitch-irc/wiki/Command-part)
- [say](https://github.com/Schmoopiie/node-twitch-irc/wiki/Command-say)
- [send](https://github.com/Schmoopiie/node-twitch-irc/wiki/Command-send)

### Questions or need help?

Contact me on Twitter [@Schmoopiie](https://twitter.com/Schmoopiie/) or [create an issue on GitHub](https://github.com/Schmoopiie/node-twitch-irc/issues).

### Copyright and license

The MIT License (MIT)

Copyright (c) 2014 Schmoopiie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.