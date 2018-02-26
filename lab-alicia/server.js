'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 2000;
const server = net.createServer();
const ee = new EE();

const clientPool = [];

ee.on('default', (client) => {
    client.socket.write('not a command - use @ symbol\n');
});

ee.on('@all', (client, string) => {
    clientPool.forEach( c => {
        c.socket.write(`${client.nickname}: ${string}`);
    })
});

ee.on('@list', (client, string) => {
    client.socket.write(`List of Users:\n`)
    clientPool.forEach(c => {
        c.socket.write(`${c.nickname}\n`);
    })
});

ee.on('@dm', (client, string) => {
   var nickname = string.split(' ').shift().trim();
   var message = string.split(' ').splice(1).join(' ').trim();
   clientPool.forEach(c => {
       if (c.nickname === nickname) {
        c.socket.write(`${client.nickname}: ${message}`);
       }
   });
});

ee.on('@nickname', (client, string) => {
    let nickname = string.split(' ').shift().trim();
    client.nickname = nickname;
    console.log(nickname, 'nickname');
    client.socket.write(`user nickname has been changed to ${nickname}\n`);
});

ee.on('@quit', (client) => {
        const index = clientPool.indexOf(client);
        console.log(clientPool, 'clientPool');
        if (index !== -1) {
            clientPool.splice(index, 1);
            console.log(clientPool, 'clientPool');
        }
    client.socket.end('Goodbye!\n');
});

server.on('connection', (socket) => {
    let client = new Client(socket);
    clientPool.push(client);

    socket.on('data', (data) => {
        const command = data.toString().split(' ').shift().trim();
        if (command.startsWith('@')) {
            ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
            return;
        }
        ee.emit('default', client);
    });
    socket.on('error', (err) => {
    console.log('Whoops! You have an error');
    throw err;
    })
});


server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});