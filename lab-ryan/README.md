#Lab 07 TCP Servers
## written by Ryan Johnson
###contributors Darcy Knore, Michael Treat, Amber Kim

##TCP Server
* This is basic chatroom format file, oporating as a communication tool between seperate users communicating through a server.
* Each user loogging in is a assigned a random user number
* Users then have the opption to assign themselves a nickname using the @nickname command function.
* Users also have the ability to communicate to the whole group using @all or directly to other users with @dm.
* Users also can end their session with @quit.
* if a user does not use the @ command they will be reminded to enter it before the command can be validated.

##Using the TCP Server
* In the terminal, inside of the lab folder, run npm run start to start the servre.
* In a new terminal shell run telnet + your IP address +  3000 and start chatting with other users on the site.
