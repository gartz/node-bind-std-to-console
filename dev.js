const net = require('net');
const path = require('path');
const fs = require('fs');

const pathToTheSocket = path.join(process.cwd(), 'dev.socket');

try {
    fs.unlinkSync(pathToTheSocket);
} catch (error) {}

const server = net.createServer().listen(pathToTheSocket, () => {
    console.info('Test server has _started, use inspector to test it.');

    const bstc = require('./bind-std-to-console');
    if (process.env.NODE_ENV !== 'production') {
        bstc.start();
    }

    setTimeout(() => {
        console.log('Console.log: foo');
        console.log('Console.log: bar');
        console.log('Console.log: zaz');

        console.error('Console.error: foo');
        console.error('Console.error: bar');
        console.error('Console.error: zaz');

        process.stdout.write('Stdout: foo\n');
        process.stdout.write('Stdout: bar\n');
        process.stdout.write('Stdout: zaz\n');
        
        process.stderr.write('Stderr: foo\n');
        process.stderr.write('Stderr: bar\n');
        process.stderr.write('Stderr: zaz\n');

        process.stdout.write(`
[32minfo[39m: Colored message 
{ key: [32m'like a json'[39m,
  number: [33m0.02632[39m,
  child: { message: [32m'This is so colorized!!!'[39m } }\n`);

        // Changing the level to debug and warn:
        bstc.stdoutToConsole = console.debug;
        bstc.stderrToConsole = console.warn;

        console.debug('Console.debug: foo');
        console.debug('Console.debug: bar');
        console.debug('Console.debug: zaz');

        console.warn('Console.warn: foo');
        console.warn('Console.warn: bar');
        console.warn('Console.warn: zaz');

        process.stdout.write('Stdout: foo\n');
        process.stdout.write('Stdout: bar\n');
        process.stdout.write('Stdout: zaz\n');

        process.stderr.write('Stderr: foo\n');
        process.stderr.write('Stderr: bar\n');
        process.stderr.write('Stderr: zaz\n');

        process.stdout.write(`
[32minfo[39m: Colored message 
{ key: [32m'like a json'[39m,
  number: [33m0.02632[39m,
  child: { message: [32m'This is so colorized!!!'[39m } }\n`);

    }, 3e3);
    
});
