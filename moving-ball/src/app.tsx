const readline = require('readline');

let acceleration = 0;

const initPos = 0;
let position = initPos;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    if (key.name === "right") {
        acceleration = 1;
        console.log("acceleration ", acceleration);
    }
    else if (key.name === "left") {
        acceleration = -1;
        console.log("acceleration ", acceleration);
    }
    else {
        acceleration = 0;
        console.log("acceleration ", acceleration);
    }
  }
});

console.log('Press any key...');
