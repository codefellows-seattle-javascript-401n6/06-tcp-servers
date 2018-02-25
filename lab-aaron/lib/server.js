'use strict';

const net = require('net');
const Event = require('events');
const Client = require('../model/client.js');

const PORT = process.env.PORT || 3000;

const chatServer = net.createServer();
const eventNew = new Event();

const chatPool = [];




chatServer.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});