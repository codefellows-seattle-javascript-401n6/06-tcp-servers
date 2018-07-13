'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./lib/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

ee.on('default', function(client) {
  client.socket.write('not a command - use an @ symbol\n');
});

ee.on('@all', function(client, string) {
  pool.forEach(c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on('@quit', client => {
  const index = pool.indexOf(client);
  if (index !== -1) {
    pool.splice(index, 1);
  }
  client.socket.end('ByE');
});

ee.on('@dm', (client, string) => {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').splice(1).join(' ').trim();

  pool.forEach(c => {
    if (c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}`);
    }
  });
});

ee.on('@nickname', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  client.nickname = nickname;
  client.socket.write(`user has changed nickname to ${nickname}\n`);
});

ee.on('@list', (client) => {
  pool.forEach(c => {
    c.socket.write('@' + c.nickname + '\n');
  });
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  pool.push(client);

  socket.on('error', error => {
    console.log('oops error', error);
    const index = pool.indexOf(client);

    if (index !== -1) {
      pool.splice(index, 1);
    }
  });

  socket.on('close', socket => {
    ee.emit('@quit', client);
  });

  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();

    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
      return;
    }
    ee.emit('deafault', client);
        
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
