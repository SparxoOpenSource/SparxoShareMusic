var Studio = require('./studio');
var exp = module.exports;

var studio = null;

exp.init = function(opts){
    if (!studio) {
        studio = new Studio(opts);
    }
};

exp.getStudio = function(){
  return studio;
};
