# Brandon Buchholz: Codefellows lab06: TCP chat bot application
 
## Introduction:
This is a chat app that utilizes TCP with Node. 
It requires:
-NPM uuid
-Homebrew telnet

## To use this application:
Open your terminal and type in:
-node server.js(this will start the server)

In a separate terminal window you will run telnet on your local server by typing in:
-telnet < your ip address> 3000

## Chat commands:
1. @quit will quit the application.
2. @all < message> will send a message to all users connected to the application.
3. @nickname < new nickname> will change your nickname from the randomly generated user name.
4. @dm < username> < message> will send the specified user a direct message that is only visible to the user.