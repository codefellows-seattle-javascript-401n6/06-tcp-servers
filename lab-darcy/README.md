# Lab 06:  TCP Servers

### Author: Darcy Knore

### Description:<br>
This project is creating a TCP chatroom. Clients should be able to connect to the chatroom through the use of telnet. 
```
~ telnet "IP address" "host-server"
```

A Client constructor will model an individual connection.  Each client instance will contain an id, nickname, and socket properties.

Clients should also be able to run special commands to:
- exit the chatroom (@quit)
- list all users (@list)
- reset their nickname (@nickname <new-name>)
- send direct messages (@dm)

Connected clients are maintained in an in-memory collection (array) called the clientPool

When a socket emits:
- close event: the socket will be removed from the client pool
- error event: the error should be logged on the server
- data event: the data should be logged on the server and the commands below should be implemented 

### Architecture:
This project uses javascript, jQuery, fs, telnet, events, uuid, and Node.js.  With the user experience in mind, the application layout was thoughtfully organized, easy to read, and able to be executed efficiently.

### Change Log
This application has not been launched.

### Credits and Collaborations