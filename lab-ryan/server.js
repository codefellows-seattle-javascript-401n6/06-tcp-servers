'use strict';

//telnet 192.168.0.8 3000 not working in terminal

const net = require('net');
const EE = require('events');
const Client = ('./lib/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const clientPool = [];

ee.on('default', function(client){
    client.socket.write('not a command - please use @ symbol\n');
});

ee.on('@all', function(client, string){
    clientPool.forEach( c => {
        c.socket.write(`${client.nickname}; ${string}`);
    })
});

ee.prependListener('@dm', function(client, string){
    let nickname = string.split(' ').shift().trim();
    let message = string.split(' ').splice(1).join(' ').trim();

    clientPool.forEach( c => {
    })
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
        const command = data.toString().split(' ').shift().trim();  // strip off /r and /n
        
        if(command.startsWith('@')) {
            ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
            console.log('success');
            return;
        }
        ee.emit('default', client);
        // console.log('command', command);
    });
     // console.log(client.nickname);
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
