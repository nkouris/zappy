'use strict';
var remote = require('electron').remote,
    args = remote.getGlobal('sharedObject').prop1;
let debug = require('./debug');
let manage = require('./manage');
let memory = require("./AI/clientMem");
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
zsock.connect({
    port: args[3],
    host: args[4]
});
/* Upon: data incoming recieved, what should be done. */
let response = "";
zsock.on('data', function (buffer) {
    debug.log('server', buffer);
    response = manage.responseToServer(buffer);
    console.log(response);
    if (response != "") {
        console.log(response);
        debug.log('client', response);
        zsock.write(response);
    }else{
        if(memory.commandSentCount < 0){
        memory.commandSentCount = 20;
            console.warn('Sending Emergency idle message', response);
            zsock.write(manage.commands[3] + '\n');
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
    manage.fork_client();
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

/* INIT RECONNECT BTN */
/* Get: DOM Reconnect Btn */
let reconnectBtn = document.getElementById("reconnectBtn");

/* Add: Onclick listener on reconnectBtn for running reconnect on zsock */
reconnectBtn.onclick = function () {
    manage.reconnect(zsock, args[4], args[3]);
}


module.exports.$Z = $Z;