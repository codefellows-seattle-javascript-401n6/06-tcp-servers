'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./lib/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const clientPool = [];

ee.on('default', function(client){
    client.socket.write('not a command - please use @ symbol\n');
    console.error('client error');
});

ee.on('@all', function(client, message) {
    clientPool.forEach( c => {
        c.socket.write(`${client.nickname}: ${message}\n`);
    });
});

ee.on('@quit', client => {
    let clientIndex = clientPool.indexOf(client);
    clientPool.splice(clientIndex, 1);
    client.socket.end(`See you next time!\n`);
});

ee.on('@list', client => {
    client.socket.write(`current user:\n`);
    clientPool.forEach(user => {
        client.socket.write(`${user.nickname}\n`);
    });
});

ee.on('@dm', function(client, string){
    let nickname = string.split(' ').shift().trim();
    let message = string.split(' ').splice(1).join(' ').trim();

    clientPool.forEach( c => {
        if(c.nickname === nickname){
            c.socket.write(`${client.nickname}: ${message}\n`);
        }
    });
});

ee.on('@nickname', function(client, string){
    let nickname = string.split(' ').shift().trim();
    client.nickname = nickname;
    client.socket.write(`user nickname changed to ${nickname}\n`);
});

server.on('connection', function(socket) {
    let client = new Client(socket);
    clientPool.push(client);

    socket.on('data', function(data) {
        const command = data.toString().split(' ').shift().trim();

        if(command.startsWith('@')) {
            ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
            console.log('user ', client.nickname, ' ran command ', command,  '.');
            return;
        }
        ee.emit('default', client);
    });
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});