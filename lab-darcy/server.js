"use strict";

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const clientPool = [];

ee.on('default', function (client) {
    client.socket.write('Not a command - must use an @ symbol\n');
});

ee.on('@all', function (client, message) {
    console.log('@all command entered');

    clientPool.forEach(c => {
        c.socket.write(`${client.nickname}: ${message}\n`);
    });
});

ee.on('@dm', function (client, string) {
    console.log('@dm command entered');

    let nickname = string.split(' ').shift().trim();
    var message = string.split(' ').splice(1).join(' ').trim();

    clientPool.forEach(c => {
        if (c.nickname === nickname) {
            c.socket.write(`${client.nickname}: ${message}\n`);
        }
    });
});

ee.on('@nickname', function (client, string) {
    console.log('@nickname command entered');

    let nickname = string.split(' ').shift().trim();
    client.nickname = nickname;
    client.socket.write(`user has changed nickname to ${nickname}\n`);
});

ee.on('@quit', function (client) {
    console.log('@quit command entered');
    console.log('ClientPool BEFORE: ', clientPool.length);

    let clientIndex = clientPool.indexOf(client);

    clientPool.splice(clientIndex, 1);
    client.socket.end('You have successfully quit chat.\n');

    console.log('ClientPool AFTER: ', clientPool.length);
});

server.on('connection', function (socket) {
    var client = new Client(socket);
    clientPool.push(client);

    socket.on('data', function (data) {
        const command = data.toString().split(' ').shift().trim();
        console.log('data= ', data);

        if (command.startsWith('@')) {
            ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
            return;
        }

        ee.emit('default', client);
    });

    socket.on('error', function (socket) {
        console.error('Error\n');
    })

    socket.on('close', function (socket) {
        ee.emit('@all', client, 'has left the chat room\n');// stretch goal!?! 
        ee.emit('@quit', client);
    })
});

server.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`);
});