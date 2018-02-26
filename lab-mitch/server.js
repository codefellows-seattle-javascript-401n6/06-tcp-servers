'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./lib/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();


const userPool = [];

ee.on('@all', function (client, string) {
    userPool.forEach(c => {
        c.socket.write(`${client.nickName}: ${string}`);
    });
});

ee.on('@dm', function (client, string) {
    var nickName = string.split(' ').shift().trim();
    var message = string.split(' ').splice(1).join(' ').trim();

    userPool.forEach(c => {
        if (c.nickName === nickName) {
            c.socket.write(`${client.nickName}: ${message}`);
        }
    });
});
// The below codeblock was inspired by Mike.
ee.on('@nick', (client, string) => {
    let newName = string.split(' ').shift().trim();
    let successFlag = true;

    if (newName === '') {
        client.socket.write('Sorry, your username must contain at least one character, it cannot be blank.\n');
        return;
    }
    userPool.forEach(c => {
        if (c.nickName.toLowerCase() === newName.toLowerCase()) {
            client.socket.write(`Sorry, that nickname has already been taken! You can add numbers to the nickname to make it unique!\n`);
            successFlag = false;
            return;
        }
    });
    if (successFlag === true) {
        let oldName = client.nickName;
        client.nickName = newName;
        client.setName = true;
        userPool.forEach(c => c.socket.write(`User ${oldName} has successfully changed their chat nickname to ${client.nickName}\n`));
    }
});

ee.on('@n', (client, string) => {
    ee.emit('@nick', client, string);
})

ee.on('default', function (client, string) {
    client.socket.write('Sorry, what you typed was not recognized as a command - please begin all commands with an @ symbol\n');
});


ee.on('@quit', function (client, string) {
    client.socket.end('You have successfully quit the chat.')
})

ee.on('@list', function (client, string) {
    userPool.forEach(function (client2) {
        client.socket.write(`The list of users is: ${client2.nickName}\n`);
    });
});

ee.on('@room', client => {
    // Finds the user and waits to push them to the end of the list.
    userPool.forEach(c => {
        client.socket.write(`Current Members in this chatRoom: ${c.nickName}\n`);
    });
});


ee.on('@help', client => {
    client.socket.write(`\n\nExpanded list of commands.\n\n @all - Sends the message to all users in chat. \n @nick or @n - Use this command to change your nickname. \n @room - Lists all the users currently in the Chatroom. \n @dm - Send a message directly to a user. \n @help - The command responsible for showing you all of this information. \n @quit - End the chat.\n\n\n`);
});

ee.on('@dm', (client, string) => {

    // Checks if the client has set a nick name.
    if (client.setName === false) {
        client.socket.write('Sorry, you must first make a user name! Use /n to set a user name! Try /help for more info!\n');
        return;
    }

    let selectedUser = string.split(' ').slice(0, 1);
    selectedUser = selectedUser.toString().toLowerCase();

    // Checks if they are trying to send a message to themsevles and stops them.
    if (selectedUser === client.nickName.toLowerCase()) {
        client.socket.write(' ** Looks like you sent a message to yourself **\n');
        return;
    }

    // Checks if the selected user is a real user.
    let foundUserFlag = false;
    userPool.forEach(c => {
        if (selectedUser === c.nickName.toLowerCase()) {
            selectedUser = c;
            foundUserFlag = true;
        }
    });

    if (foundUserFlag === false) client.socket.write(`\n Sorry, we can't find ${selectedUser} Names are not case sensitive, so double check the spelling!\n`);

    // Final Check. Checks if the other user has set a username.
    if (selectedUser.setName) {
        let data = string.split(' ').slice(1).join(' ');
        selectedUser.socket.write(`Private Message: \n ${client.nickName} says: ${data}\n`);
        //client.socket.write(`Message To ${selectedUser.nickName}: ${data}\n`);
        return;
    }
    client.socket.write(`Sorry, ${selectedUser.nickName} hasn't set a user name. You can try asking them in chat to set one if you want to send them a private message!\n`);

});





ee.on('%!welcome', client => {
    client.socket.write(`\n\nWELCOME! Here's a quick list of our commands! Type @help for more info! \n\n @all \n @nick or @n\n @room \n @dm\n @help\n @quit\n\n\n`);
});



server.on('connection', function (socket) {
    var client = new Client(socket);
    userPool.push(client);

    socket.on('data', function (data) {
        const command = data.toString().split(' ').shift().trim();

        if (command.startsWith('@')) {
            ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
            console.log('My command after the at:', data.toString().split(' ').splice(1).join(' '));
            return;
        }
        ee.emit('default', client, data.toString());
    });
    ee.emit('%!welcome', client);
    ee.emit('@room', client);
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});


// Minimum Requirements
// Create a TCP Server using the NodeJS net module
// Create a Client constructor that models an individual connection
// Each client instance should contain (at least) id, nickname, and socket properties
// Clients should be able to send messages to all other clients by sending it to the server
// Clients should be able to run special commands by sending messages that start with a command name
// The client should send @quit to disconnect
// The client should send @list to list all connected users
// The client should send @nickname <new-name> to change their nickname
// The client should send @dm <to-username> <message> to send a message directly to another user by their nickname
// Connected clients should be maintained in an in-memory collection (array) called the clientPool
// When a socket emits the close event, the socket should be removed from the client pool
// When a socket emits the error event, the error should be logged on the server
// When a socket emits the data event, the data should be logged on the server and the commands below //should be implemented