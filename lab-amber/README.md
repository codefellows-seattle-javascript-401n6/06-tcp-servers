# Amber Kim: Codefellows lab 06: TCP Chatbot Application

## Introduction
This is a simple chat app utilizing TCP through Node.js It requires:
* npm uuid
* homebrew telnet

## To Run This Application
Run server.js. Some example tools and commands you can use:
```
node server.js
// for node

nodemon server.js
// if you have nodemon installed globally

npm run start
// the package.json in this repo is configured to run "nodemon server.js" with this command.
```

Run telnet on your server by typing
```
telnet <your ip address> 3000
```

## Chat Commands
1. List out all the available commands
```
@help
```

2. Quitting the App
```
@quit
```

3. Sending the message to all clients connected to the app
```
@all <your message>
```

4. Changing your user nickname
```
@nickname <your new name>
```

5. Sending someone a direct message
```
@dm <username> <message>
```