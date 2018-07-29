const http = require('http');
const io = require('socket.io-client');
const ncp = require("copy-paste");

var socket = io.connect('http://localhost:3000');
var socketid = ncp.paste();

socket.on("connect", function(){
  console.log(socketid);
  socket.emit("controller", {id: socketid});

  socket.on("verified", function(){
    const five = require("johnny-five");
    const board = new five.Board();
    board.on("ready", function() {
      var joystick = new five.Joystick({
        pins: ["A0", "A1"]
      });
      let px = 0;
      let py = 0;
      joystick.on("change", function() {
        console.log("Joystick");
        console.log("x : ", this.x);
        console.log("y : ", this.y);
        const $x = this.x;
        const $y = this.y;
        if(Math.abs($x - px) > 0.004 || Math.abs($y - py) > 0.004){
          socket.emit("joystick", {
            x: $x,
            y: $y
          });
        }
        px = $x;
        py = $y;
      });
    });

  });
});
