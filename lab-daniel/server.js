'use strict';

const net = require('net');
const EE = require('events');
const Client = require(`${__dirname}/lib/client.js`);
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

server.on('connection', (socket) => {
    let client = new Client(socket);
    pool.push(client);
    console.log(client.nickname);
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}!`);
});