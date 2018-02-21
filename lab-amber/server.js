'use strict';

const net = require('net');
const Events = require('events');

const Client = require('./models/client.js');

const PORT = process.env.PORT || 3000;

const events = new Events();
const server = net.createServer();

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});