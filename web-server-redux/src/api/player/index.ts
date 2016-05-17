import q = require("q");

export function getList(){
    var def = q.defer();
    setTimeout(function () {
        def.resolve([
            { a: 1 },
            { a: 2 },
            { a: new Date().toString() }
        ]);
    }, 2000);
    
    return def.promise;
}