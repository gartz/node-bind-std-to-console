const { Writable } = require('stream');

const consoleTypeMessage = Symbol('console');

function BindStdToConsole() {
    this._stdoutIncompleteLine = '';
    this._stdoutChunkFromConsole = undefined;
    this._stdoutWriteToOrigin = process.stdout.write.bind(process.stdout);
    this._stdoutRaw = undefined;
    this._stdoutWrite = undefined;

    this._stderrIncompleteLine = '';
    this._stderrChunkFromConsole = undefined;
    this._stderrWriteToOrigin = process.stderr.write.bind(process.stderr);
    this._stderrRaw = undefined;
    this._stderrWrite = undefined;

    this.started = false;

    if (process.env.NODE_ENV === 'development') {
        this.start();
    }
}

BindStdToConsole.prototype.start = function () {
    const self = this;

    // Avoid to be executed twice
    if (this.started) {
        return;
    }
    this.started = true;

    this._stdoutRaw = process.stdout.write;
    this._stderrRaw = process.stderr.write;

    const processStdout = new Writable({
        write(chunk, encoding, callback) {

            const chunkString = `${chunk}`;
            if (chunk[consoleTypeMessage]) {

                if (self._stdoutChunkFromConsole) {
                    self._stdoutChunkFromConsole = undefined;
                    return callback();
                }

                self._stdoutWriteToOrigin(chunkString);
                return callback();
            }

            self._stdoutIncompleteLine += chunkString;
            const breakLine = self._stdoutIncompleteLine.lastIndexOf('\n');

            if (breakLine > -1) {
                const log = self._stdoutIncompleteLine.slice(0, breakLine);
                self._stdoutIncompleteLine = self._stdoutIncompleteLine.slice(breakLine + 1) || '';
                self._stdoutChunkFromConsole = chunk;
                console.log(log);
            }
            self._stdoutWriteToOrigin(chunk);
            callback();
        }
    });

    const consoleStdout = new Writable({
        write(chunk, encoding, callback) {
            const buf = Buffer.from(chunk);
            buf[consoleTypeMessage] = true;
            processStdout.write(buf);
            callback();

        }
    });

    this._stdoutWrite = processStdout.write.bind(processStdout);
    process.stdout.write = this._stdoutWrite;
    console._stdout = consoleStdout;

    const processStderr = new Writable({
        write(chunk, encoding, callback) {

            const chunkString = `${chunk}`;
            if (chunk[consoleTypeMessage]) {

                if (self._stderrChunkFromConsole) {
                    self._stderrChunkFromConsole = undefined;
                    return callback();
                }

                self._stderrWriteToOrigin(chunkString);
                return callback();
            }

            self._stderrIncompleteLine += chunkString;
            const breakLine = self._stderrIncompleteLine.lastIndexOf('\n');

            if (breakLine > -1) {
                const log = self._stderrIncompleteLine.slice(0, breakLine);
                self._stderrIncompleteLine = self._stderrIncompleteLine.slice(breakLine + 1) || '';
                self._stderrChunkFromConsole = chunk;
                console.error(log);
            }
            self._stderrWriteToOrigin(chunk);
            callback();
        }
    });

    const consoleStderr = new Writable({
        write(chunk, encoding, callback) {
            const buf = Buffer.from(chunk);
            buf[consoleTypeMessage] = true;
            processStderr.write(buf);
            callback();

        }
    });

    this._stderrWrite = processStderr.write.bind(processStderr);
    process.stderr.write = this._stderrWrite;
    console._stderr = consoleStderr;
};

BindStdToConsole.prototype.stop = function () {
    this.started = false;
    if (this._stdoutWrite === process.stdout.write && this._stdoutRaw) {
        process.stdout.write = this._stdoutRaw;
        console._stdout = process.stdout;
    }
    if (this._stderrWrite === process.stderr.write && this._stderrRaw) {
        process.stderr.write = this._stderrRaw;
        console._stderr = process.stderr;
    }
};

module.exports = new BindStdToConsole();
