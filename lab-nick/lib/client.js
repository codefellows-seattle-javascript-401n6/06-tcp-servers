'use strict';

const uuidv4 = require('uuid/v4');

const Client = module.exports = function(socket) {
  this.socket = socket;
//   this.nickname = `user_${Math.random()}`;
  this.nickname = `user_${uuidv4()}`;
//   this.id = uuidv4();
}