# Ronnie Lewis 
##### Codefellows 401 FullStack Javascript
### Lab 06 TCP Chat Server


Clients can connect to the chatroom through the use of telnet. Clients can also
run special commands to exit the chatroom, list all users, reset their nickname, and send direct messages. 




### features

- Each client instance contains id, nickname, and socket properties

- Clients can send messages to all other clients by sending it to the server

- Clients can run special commands by sending messages that start with a command
  name

### commands

- The client can send @quit to disconnect
- The client can send @list to list all connected users
- The client can send @nickname <new-name> to change their nickname
- The client can send @dm <to-username> <message> to send a message directly to    another user by their nickname

