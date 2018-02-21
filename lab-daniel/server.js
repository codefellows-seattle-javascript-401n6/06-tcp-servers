'use strict';

const net = require('net');
const EE = require('events');
const Client = require(`${__dirname}/lib/client.js`);
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

//Creates a client. Issues it an ID.
server.on('connection', (socket) => {
    let client = new Client(socket);
    pool.push(client);
    console.log(client.nickname);
    socket.on('data', (data) => {
        const textInput = data.toString().split(' ').shift().trim();
        console.log(textInput);
        if(command.startsWith('@')){
            ee.emit(command, client, data.toString().split().splice(1)).join(' ');
            console.log('it works!');
            return;
        }

        ee.emit('default');
    });
});


//Tells you which port you are on.
server.listen(PORT, () => {
    console.log(`listening on ${PORT}!`);
});