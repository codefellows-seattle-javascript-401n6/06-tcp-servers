'use strict';

const net = require('net');
const EE = require('events');
const Client = require(`${__dirname}/lib/client.js`);
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];


//Alerts user that they need to use @ symbol.
ee.on('default',(client) => {
    client.socket.write('not a command - use and @ symbol - - >');
});


//Allows user to send direct messages to other users.
ee.on('@dm', (client, string) => {
    var nickname = string.split(' ').shift().trim();
    var message = string.split(' ').splice(1).join(' ').trim();

    pool.forEach( c => {
        if(c.nickname === nickname){
            c.socket.write(`${client.nickname}: ${message}`);
        }
    });
});

//Shows all connected users.
ee.on('@list', (client, string) => {
    pool.forEach(users =>{
        users.socket.write(`User id: ${client.nickname}\n`);
    });
});

//Creates a user. Issues them an ID.
server.on('connection', (socket) => {
    let client = new Client(socket);
    pool.push(client);
    console.log(client.nickname);
    socket.write('Connected!\n')

    socket.on('data', (data) => {
        const command = data.toString().split().shift().trim();
        console.log('=>:', command);
        if(command.startsWith('@')) {
            ee.emit(command, client, data.toString().split().splice(1).join());
            return;
        }
        ee.emit('default', client);
    });
});

//Allows user to create nickname
ee.on('@nickname', (client, string) => {
    let nickname = string.toString().split(' ').shift().trim();
    client.nickname = nickname;
    client.socket.write(`Your nickname is now: ${nickname}`);
});


//Tells you which port you are on.
server.listen(PORT, () => {
    console.log(`listening on ${PORT}!`);
});