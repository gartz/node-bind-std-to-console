# bind-std-to-console
Run node with --inspect and see what is in your stdout and stderr. Simple like first import in your app boot.

It should be used only in development mode. It will reduce your production server performance.

## Motivation

I've been using [Winston logger](https://github.com/winstonjs/winston) for a while now, and I usually have my [Node inspector](https://nodejs.org/en/docs/inspector/) open in development. For the right reasons [Winston console transport](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport) log directly to stdout and stderr instead of using the `console.log` and `console.error` from Node JS.

This small module will help you to see all of that messages in your inspector window. But again, don't use it for production!

The reason that Winston sends directly to stdout/stderr is that those streams are nonblocking implementations and it will have a small performance impact in your application. The [Console API](https://nodejs.org/api/console.html) documentation have a friendly warning:

> **Warning**: The global console object's methods are neither consistently synchronous like the browser APIs they resemble, nor are they consistently asynchronous like all other Node.js streams. See the [note on process I/O](https://nodejs.org/api/process.html#process_a_note_on_process_i_o) for more information.

That's why you should never run this in production. It will only start automaticaly if it's in a `development`. Enjoy it :)

Install:

```bash
npm install bind-std-to-console --save-dev
```

Before to your app before other libs, as closes as to the first line, most probably you will capture all the stdout and stderror output.
```js
require('bind-std-to-console');
// The logic from your server app
```
