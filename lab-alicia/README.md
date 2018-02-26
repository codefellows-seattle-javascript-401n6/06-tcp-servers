# TCP Server Chatbot App
#### Author: Alicia Lycan

## Introduction:
The Chatbot App is a chat application utilizing the NodeJS `net` module to create a simple TCP (Transmission Control Protocol) server through the use of network sockets to transmit nodes. This application is useful for learning how the transport layer of the OSI model functions via a PORT (browser), IP address (computer), and socket (browser tab). 

## Installment:
- Fork this repository
- Start up your server in the terminal
```
node server.js
// to start server

nodemon server.js
// if you have the nodemon npm package installed globally start server with nodemon
```
Start telnet in your command line in a seperate browser tab
```
telnet <your computer's ip address> <your PORT>
```
## Chat Commands:
### List of commands
* Display list of all users:
```
@list
```
* Send message to all users: 
```
@all <enter message here>
```
* Change your user nickname:
```
@nickname <enter your new name here>
```
* Send a direct message to another user:
```
@dm <username> <enter message here>
```
* Quit the app:
```
@quit
```
