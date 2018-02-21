'use strict';

const net = require('net');
const EE = require('events');
// const Client = require('../lib/client,js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();


server.listen(PORT, () => {
    console.log(`listening on ${PORT}!`);
});