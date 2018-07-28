const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

const config = {
  width:  1000,
  height: 1000,
  tickSpeed: 100 //ms
};
var active = 0;
var plyr = {};
var plyrID = [];
function Player(){
  this.x = 0;
  this.y = 0;
  this.a = 0;  // rotation alignment
  this.xv = 0;
  this.yv = 0;
  this.av = 0; // angular vel
  this.ap = 100; // armour
  this.sp = 100; // shield
  this.accel = 2;
  this.state = "";
}
Player.prototype.update = function(){
  switch(this.state){
    case "W":
      this.xv += Math.cos(this.a) * this.accel;
      this.yv += Math.cos(this.a) * this.accel;
      break;
    case "S":
      this.xv -= Math.cos(this.a) * this.accel;
      this.yv -= Math.cos(this.a) * this.accel;
      break;
    case "A":
      this.av -= this.ts;
      break;
    case "D":
      this.av += this.ts;
      break;
  }
  console.log(`${this.state}:${this.xv}`);
}
Player.prototype.updateState = function(input){
  switch(input){
    case "W":
    case "S":
    case "A":
    case "D":
    case "":
      this.state = input;
      break;
    default:
    return true; // I N V A L I D    M O V E M E N T   :hyperAngery:
  }
}

function update(){
  for(let i = 0; i < plyrID.length; i ++){
    let socketID = plyrID[i];
    let self = plyr[socketID];
    self.update();
    // Checking from index of all tokenids, call from object and update.
    let data = {
      x: self.x,
      y: self.y,
      a: self.a,
      xv: self.xv,
      yv: self.yv,
      av: self.av,
      ap: self.ap,
      sp: self.sp,
      state: self.state
    };
    io.to(socketID).emit('update', data);
  }
}

io.on('connection', function(socket){
  console.log(' > new connection! cID: ' + socket.id);
  setTimeout(function(){socket.broadcast.emit('nP', ++active);}, 2000);

  plyr[socket.id] = new Player();
  plyrID.push(socket.id);
  socket.on('input', function(data){
    if(plyr[socket.id].updateState(data)){
      console.log("DISCONNECTED!!!")
      socket.disconnect();
    }
  });
  socket.on('disconnect', function(){
    delete plyr[socket.id];
    plyrID.splice(plyrID.indexOf(socket.id), 1);
    console.log(' < disconnection!  cID: ' + socket.id);
    socket.broadcast.emit('nP', --active);
  });
});

http.listen(3000, '0.0.0.0', function(){
  console.log('listening on *:3000');
});
setInterval(update, config.tickSpeed);
