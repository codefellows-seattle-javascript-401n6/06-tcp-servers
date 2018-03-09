
'use strict';

const uuidv4 = require('uuid/v4');
const Client = module.exports = function(socket) {
    this.socket = socket; //information about the connection
    this.nickname = `user_${Math.random()}`; //guest username=unique identifer
    this.id = uuidv4();
}