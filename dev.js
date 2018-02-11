const net = require('net');
const path = require('path');
const fs = require('fs');

const pathToTheSocket = path.join(process.cwd(), 'dev.socket');

try {
    fs.unlinkSync(pathToTheSocket);
} catch (error) {}

const server = net.createServer().listen(pathToTheSocket, () => {
    console.info('Test server has started, use inspector to test it.');

    require('./index');

    setTimeout(() => {
        console.log('Console: foo');
        console.log('Console: bar');
        console.log('Console: zaz');

        process.stdout.write('Stdout: foo\n');
        process.stdout.write('Stdout: bar\n');
        process.stdout.write('Stdout: zaz\n');
        
        process.stderr.write('Stderr: foo\n');
        process.stderr.write('Stderr: bar\n');
        process.stderr.write('Stderr: zaz\n');
    }, 3e3);
    
});
