var async = require('async');
var Q = require('q');


function a(callback) {
    var deferred = Q.defer();
    setTimeout(function () {
        return deferred.resolve(1);
    }, 1000);
    return deferred.promise;
}

function b(v) {
    console.log(v);
}

var deferred = Q.defer();
deferred.promise.then(a).then(b);
deferred.resolve();

//async.series([
//    function (callback) {
//        setTimeout(function () {
//            console.log(1);
//            callback(null, 1);
//        }, 1000);
//    },

//    function (callback) {
//        console.log(2);
//        callback(null, 'two');
//    }
//],
//// optional callback
//function (err, results) {
//    console.log(err);
//    console.log(results);
//});
