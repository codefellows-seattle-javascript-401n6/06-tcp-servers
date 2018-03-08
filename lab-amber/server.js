'use strict';

const net = require('net');
const Events = require('events');
const Client = require('./models/client');

const PORT = process.env.PORT || 3000;

const events = new Events();
const server = net.createServer();


const clientPool = [];
const commands = ['@quit ends your session', '@list lists all cliets in the pool', '@all <your message> sends your message to all the clients in the pool', '@nickname <new nickname> will change your nickname to the new nickname', '@dm <client nickname> direct messages the client'];

events.on('default', client => {
  client.socket.write(`Not a command - use an @ symbol\n`);
});

events.on('@list', client => {
  client.socket.write(`Current Users:\n`);
  clientPool.forEach(user => {
    client.socket.write(`${user.nickname}\n`);
  });
});

events.on('@all', (client, string) => {
  clientPool.forEach(user => {
    user.socket.write(`${user.nickname}: ${string}`);
  });
});

events.on('@nickname', (client, string) => {
  let nickname = string.split(' ').shift().trim();
  client.nickname = nickname;
  client.socket.write(`User has changed their nickname to ${nickname}\n`);
});

events.on('@dm', (client, string) => {
  var nickname = string.split(' ').shift().trim();
  var message = string.split(' ').splice(1).join(' ').trim();
  clientPool.forEach(client => {
    if (client.nickname === nickname) {
      client.socket.write(`${client.nickname}: ${message}\n`);
    }
  });
});

events.on('@help', (client, string) => {
  client.socket.write(`AVAILABLE COMMANDS:\n`);
  commands.forEach(command => {
    client.socket.write(`${command}\n`);
  });
});

function closeSocket(client) {
  console.log('inside close socket');
  for (let i = 0; i < clientPool.length; i++) {
    if (client.nickname === clientPool[i].nickname) {
      clientPool.splice(i, 1);
      client.socket.end('Goodbye!\n');
    }
  }
}

events.on('@quit', client => {
  closeSocket(client);
});


server.on('connection', socket => {
  let client = new Client(socket);
  clientPool.push(client);

  socket.on('data', data => {
    const command = data.toString().split(' ').shift().trim();
    const string = data.toString().split(' ').splice(1).join(' ');
    if (command.startsWith('@')) {
      events.emit(command, client, string);
      console.log('Data Emitted', data.toString());
    } else {
      events.emit('default', client);
    }
  });
}).on('error', err => {
  throw err;
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});