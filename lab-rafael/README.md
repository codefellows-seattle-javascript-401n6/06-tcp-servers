# Simple TCP chatroom

** Author: ** Rafael Malave

Clients can connect to the chatroom through the use of telnet. Clients can also run special commands to exit the chatroom, list all users, reset their nickname, and send direct messages.

## commands

- @quit to disconnect from chat
- @list to list all connected users
- @nickname <new-name> to change your nickname
- @dm <to-username> <message> to send a message directly to another user by their nickname

## Features

- Connected clients are maintained in an in-memory collection (array) called the clientPool
- When a socket emits the close event, the socket is removed from the client pool
- When a socket emits the error event, the error is logged on the server
- When a socket emits the data event, the data is logged on the server and the commands below should be implemented

## Technologies

- Nodejs
- Javascript
- Telnet
