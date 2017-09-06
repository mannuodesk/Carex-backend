var crypto = require('crypto');

var SaltLength = 9;

var PasswordHashing = function Constructor() {

};

PasswordHashing.prototype.createHash=function(password) {
  var salt = this.generateSalt(SaltLength);
  var hash = this.md5(password + salt);
  console.log("Pasword is "+password);
  console.log("hash is "+hash);
  console.log("salt is "+salt);
  return salt + hash;
}

PasswordHashing.prototype.validateHash=function(hash, password) {
  var salt = hash.substr(0, SaltLength);
  console.log("Salt is "+salt);
  var validHash = salt + this.md5(password + salt);
  return hash == validHash;
}

PasswordHashing.prototype.generateSalt=function(len) {
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
      setLen = set.length,
      salt = '';
  for (var i = 0; i < len; i++) {
    var p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}

PasswordHashing.prototype.md5=function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

module.exports = PasswordHashing;