'use strict';

const net = require('net');
const EE = require('events');
const Client = require(`${__dirname}/lib/client.js`);
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

ee.on('default', function(client) {
    client.socket.write('not a command - use and @ symbol');
});


//Creates a client. Issues it an ID.
server.on('connection', (socket) => {
    let client = new Client(socket);
    pool.push(client);
    console.log(client.nickname);
    
    socket.write('Message:')

    socket.on('data', (data) => {
        const command = data.toString().split(' ').shift().trim();
        console.log(command);
        if(command.startsWith('@')) {
            ee.emit(command, client, data.toString().split().splice(1).join());
            console.log('it works!');
            return;
        }
        ee.emit('default', client);
    });
});

ee.on('@nickname', (client, string) => {
    let nickname = string.toString().split(' ').shift().trim();
    client.nickname = nickname;
    client.socket.write(`Your nickname is now: ${nickname}`);
})

//Tells you which port you are on.
server.listen(PORT, () => {
    console.log(`listening on ${PORT}!`);
});