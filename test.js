var filter = require("lodash.where");
const json = {
  "20394802934890328490832": {
    private: true,
    owned: true
  },
  "20394802934832": {
    private: true,
    owned: true
  },
  "4802934890328490832": {
    private: false
  },
  "2039480293489032": {
    private: true
  },
  "203948890328490832": {
    private: true
  },
  "203948029": {
    private: false
  },
}

var arrFound = Object.keys(json).filter(function(key) {
  return json[key].private == true && json[key].owned == true;
// to cast back from an array of keys to the object, with just the passing ones
}).reduce(function(obj, key){
  obj[key] = json[key];
  return obj;
}, {});;

console.log(arrFound)