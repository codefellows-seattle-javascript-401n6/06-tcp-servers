'use strict';

const uuidv4 = require('uuid/v4');

const Client = module.exports = function(socket) {
  this.socket = socket;
  this.nickName = `user_${Math.random()}`;
  this.id = uuidv4();
}

