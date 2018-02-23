# TCP Chat Server

To run the TCP Chat Server, cd into the lab-trevor directory.  In the command line run `node index.js`.  The terminal should log listening on port 3000. In another terminal run `telnet ip address of server 3000`.  At this point you will be connected to the the Chat Server.

## Using The TCP Chat Server

```
@help - Displays list of commands
@list - Displays list of connected users
@nickname new nickname - Changes your nickname
@all - sends message to all connected users
@dm nickname - sends message to only that user
@quit - Disconnects you from the chat server
```