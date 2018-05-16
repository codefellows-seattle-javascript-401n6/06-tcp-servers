'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];
const commands = ['@quit ends your session','@list lists all clients in the pool', '@nickname <new nickname> will change your nickname to the new nickname','@dm <client nickname> direct messages the client'];

ee.on('@all', function(client, string) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on('@dm', function(client, string) {
  var nickname = string.split(' ').shift().trim();
  var message = string.split(' ').splice(1).join(' ').trim();

  pool.forEach( c => {
    if (c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}`);
    }
  });
});

ee.on('@list', client =>{
  client.socket.write(`Current Users :\n`);
  pool.forEach(user => {
    client.socket.write(`${user.nickname}\n`);
  });
});

ee.on('@nickname', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  client.nickname = nickname;
  client.socket.write(`user nickname has been changed to ${nickname}\n`);
});

ee.on('default', function(client, string) {
  client.socket.write('not a command - please use an @ symbol\n');
});

ee.on('@help', (client, string)=>{
  client.socket.write(`AVAILABLE COMMANDS: \n`);
  commands.forEach(command =>{
    client.socket.write(`${command}\n`);
  });
});

function closeSocket(client){
  console.log('inside close socket');
  for(let i = 0; i < pool.length; i++){
    if (client.nickname === pool[i].nickname){
      pool.splice(i,1);
      client.socket.end('Goodbye\n');
    }
  }
}

ee.on('@quit', client =>{
  closeSocket(client);
});

server.on('connection', function(socket) {
  let client = new Client(socket);
  pool.push(client);

  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();
    const string = data.toString().split(' ').splice(1).join(' ');
    if (command.startsWith('@')) {
      ee.emit(command, client, string);
      console.log('my command after the at:', data.toString().split(' ').splice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});