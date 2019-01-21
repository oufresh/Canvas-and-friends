var k1 = {
    z: 1,
    x: 0,
    y: 0
};

var k2 = {
    z: 1,
    x: 1,
    y: 0
};

var k3 = {z: 1, x:0, y: 1};
var k4 = {z:1, x:1,y:1};

var multiMap = new Map();
multiMap.set(k1, "pippo");
multiMap.set(k2, "ciccio");
multiMap.set(k3, "pluto");
multiMap.set(k4, "paperino");

multiMap.forEach((v, k) => {
    console.log("---------");
    console.log(k);
    console.log(v);
    console.log("---------");
});

console.log("prove chiave");
console.log(multiMap.get(k2));