# bind-std-to-console
Run node with --inspect and see what is in your stdout and stderr. Simple like first import in your app boot.

It should be used only in development mode. It will reduce your production server performance.

Install:

```bash
npm install bind-std-to-console --save-dev
```

Before to your app before other libs, as closes as to the first line, most probably you will capture all the stdout and stderror output.
```js
require('bind-std-to-console');
// The logic from your server app
```
