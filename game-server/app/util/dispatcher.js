var crc = require('crc');

module.exports.dispatch = function (uid, connectors) {
    var index = Number(uid) % connectors.length;
    return connectors[index];
};

module.exports.dispatchByString = function(name, connectors) {
    var index = Math.abs(crc.crc32(name)) % connectors.length;
    return connectors[index];
};