'use strict';

const net = require('net');
const EE = require('events');
const Client = ('./lib/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});