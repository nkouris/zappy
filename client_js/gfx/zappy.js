'use strict';

let debug = require('./debug');
let manage = require('./manage');
let gfx = require('./gfx');
/* Import: the net library for using unix sockets in js. */
let unixSock = require('net');
/* Zappy Controller */
let $Z = {
    mapWidth: -1,
    mapHeight: -1
};
/* INIT MAIN CLIENT SOCKET */
/* Create: a Zappy Socket (zsock) */
let zsock = new unixSock.Socket({
    readable: true,
    writable: true
});
/* Set the encoding for the socket to utf8 */
zsock = zsock.setEncoding('utf8');
/* Connect: the zsock to the correct destination. */
gfx.loadify(function(){
    zsock.connect({
        port: 5001,
        host: 'localhost'
    });
});
/* Upon: data incoming recieved, what should be done. */
let response = "";
zsock.on('data', function (buffer) {
    debug.log('server', buffer);
    buffer = buffer.split('\n');
    for(let newBuff of buffer){
        response = "";
        response = manage.responseToServer(newBuff);
        if (response != "") {
            debug.log('client', response);
            zsock.write(response);
        }
    }
});

zsock.on('connect', function () {
    debug.log("client", "Successfully Connected to host");
});
zsock.on('error', function (err) {
    debug.err(err);
});

zsock.on('close', function (err) {
    debug.err("client", "Socket closed");
});

zsock.on('end', function (err) {
    debug.err("server", "Server Disconnected");
});

zsock.on('drain', function (err) {
    debug.err("client", "Write buffer drained");
});

zsock.on('ready', function (err) {
    debug.log("client", "socket is ready to use");
});

zsock.on('timeout', function (err) {
    debug.log("client", "socket timed out due to inactivity");
});

// /* Add: Onclick listener on reconnectBtn for running reconnect on zsock */
// reconnectBtn.onclick = function(){
    // manage.reconnect(zsock, "localhost", 5001);
// }


module.exports.$Z = $Z;