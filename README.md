# node-twitch-irc

Node.js module allowing you to connect to Twitch and handle multiple events asynchronously.

![](https://nodei.co/npm/node-twitch-irc.png?downloads=true&stars=true)

![](https://david-dm.org/Schmoopiie/node-twitch-irc.png)

### Installation

1- Install [Node.js](http://nodejs.org/download/)

2- Install node-twitch-irc via NPM:
```
npm install node-twitch-irc
```
3- Check out the [examples on GitHub](examples) of how to use node-twitch-irc.

### Events

- [action](examples/events.js#L21)
- [chat](examples/events.js#L26)
- [clearchat](examples/events.js#L31)
- [connected](examples/events.js#L36)
- [disconnected](examples/events.js#L41)
- [join](examples/events.js#L46)
- [mode](examples/events.js#L51)
- [names](examples/events.js#L56)
- [raw](examples/events.js#L67)
- [subscribe](examples/events.js#L72)
- [timeout](examples/events.js#L77)

### Commands

- [join](examples/commands.js#L42)
- [part](examples/commands.js#L56)
- [say](examples/commands.js#L36)

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