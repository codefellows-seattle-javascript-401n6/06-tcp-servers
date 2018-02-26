'use strict';

const uuidv4 = require('uuid/v4');

const client =  module.exports = function(socket) {
    this.socket = socket;
    this.nickname = 'user_${Math.random()}';
    this.id = uuidv4();
}