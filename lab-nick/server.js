'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./lib/client.js');
// const Commands = require('./model/commands.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const clientPool = [];

//send message to whole group
ee.on('@all', (client, string) => {
    clientPool.forEach(c => {
        c.socket.write(`${client.nickname}: ${string}`);
    });
});

//send direct message
ee.on('@dm', (client, string) => {
    var nickname = string.split(' ').shift().trim();
    var message = string.split(' ').splice(1).join(' ').trim();

    clientPool.forEach(c => {
        if (c.nickname === nickname) {
            c.socket.write(`${client.nickname}: ${message}`);
        }
    });
});

//change defalut nickname to custom name
ee.on('@nickname', (client, string) => {
    let nickname = string.split(' ').shift().trim();
    client.nickname = nickname;
    client.socket.write(`You have changed your nickname to ${nickname}\n`);
});

//List currently connected users
ee.on('@list', (client, string) => {
    for (let i = 0; i < clientPool.length; i++) {
        client.socket.write(`${clientPool[i].nickname}\n`);
    }
});

//Disconnect from chat
ee.on('@quit', (client) => {
    client.socket.write(`You have ended your session.\n`);
    client.socket.end();
});

//Manual
ee.on('@man', (client) => {
    client.socket.write(`@quit to exit server.\n`);//each line
    client.socket.write(`@nickname "new name" to change your display name.\n`);
    client.socket.write(`@list show list of users currently connected.\n`);//each line
    client.socket.write(`@all "message" sends a message to everyone on server.\n`);//each line
    client.socket.write(`@dm "nickname" "message" personal message to singe user.\n`);//each line
    // client.socket.write(`Line 3.\n Line4.@\n`);//nested line
});

//not a valid command message
ee.on('default', (client, string) => {
    client.socket.write('not a command - use an @ symbol\n');
})



server.on('connection', (socket) => {
    var client = new Client(socket);
    clientPool.push(client);
    client.socket.write(`Use @man to see available commands.\n`);//login message

    //feeble attampt to have user create a nick name at connection.
    client.socket.write(`Enter a nickname: `);
    // let nickname = string.split(' ').shift().trim();
    // client.nickname = nickname;
    // client.socket.write(`You have changed your nickname to ${nickname}\n`);

    console.log(client);
    
    socket.on('data', (data) => {
        const command = data.toString().split(' ').shift().trim();

        if (command.startsWith('@')) {
            ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
            // console.log('command: ' + command);
            return;
        }

        ee.emit('default', client, data.toString());
        // console.log('command: ' + command);
    });
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});