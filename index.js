const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const config = {
  targetFrameRate: 30
};

app.use(express.static('./public'));

var gmap = [];
for(let i = 0; i < 10; i ++){
  gmap.push([]);
  for(let j = 0; j < 10; j ++){
    if((i+1) % 3 === 0 || j % 4 === 0){
      gmap[i].push("=");
    }else{
      gmap[i].push(" ");
    }
  }
}

var plyr = {};
var plyrID = [];
var activeSockets = {};
var waitingSockets = {};
var controllerSockets = {};
function Player(){
  this.x = 100;
  this.y = 100;
  this.r = 0;
  this.v = 1;
  this._r = 0;
  this._v = 1;
}
Player.prototype.updateState = function(cx, cy){
  if(Math.abs(cx) > 1 || Math.abs(cy) > 1) return;
  this._r = cx*2;
  this._v = cy*5;
};
Player.prototype.process = function(){
  this.x += Math.cos(this.r) * this.v;
  this.y += Math.sin(this.r) * this.v;
  this.r += this.v * this._r * Math.PI/180;
  //this.v /= 1.1;
  this.v -= (this.v - this._v) / 20;
};
Player.prototype.getData = function(){
  return {
    x: this.x,
    y: this.y,
    r: this.r,
    v: this.v,
  }
};

function update(){
  for(let i = 0; i < plyrID.length; i ++){
    const Plyr = plyr[plyrID[i]];
    Plyr.process();
    let updateData = {self: Plyr, others: []};
    for(let j = 0; j < plyrID.length; j ++){
      if(i === j) continue;
      updateData.others.push(plyr[plyrID[j]].getData());
    }
    io.to(plyrID[i]).emit("dataBroadcast", updateData)
  }
}

function disconnect(socketid){
  console.log(' < disconnection!  cID: ' + socketid);
  delete waitingSockets[socketid];
  delete controllerSockets[socketid];
  setTimeout(function(){
    delete plyr[socketid];
    plyrID.splice(plyrID.indexOf(socketid), 1);
    console.log(' < deleted user    cID: ' + socketid);
  }, 10000);
}

plyrID.push("f");
plyr.f = new Player();
io.on('connection', function(socket){
  console.log(' > new connection! cID: ' + socket.id);
  waitingSockets[socket.id] = true;

  /*socket.on('input', function(data){
    if(plyr[socket.id]){
      if(plyr[socket.id].updateState(data)){
        console.log("DISCONNECTED!!!")
        socket.disconnect();
      }
    }else{
      plyr[socket.id] = new Player();
      plyrID.push(socket.id);
    }
  });
  socket.on('requestConfig', function(name){
    if(!name) name = defaultNames[plyrID.length % defaultNames.length];
    plyr[socket.id].name = name.substr(0, 16);
    io.to(socket.id).emit('setConfig', config);
  });*/
  socket.on('disconnect', function(){
    disconnect(socket.id);
  });

  socket.on("controller", function(data){
    console.log("received socket claim of " + data.id + " from " + socket.id)
    if(waitingSockets[data.id]){
      io.to(socket.id).emit("verified", {});
      delete waitingSockets[socket.id];
      delete waitingSockets[data.id];
      controllerSockets[socket.id] = data.id;
      plyrID.push(data.id);
      activeSockets[data.id] = plyr[data.id] = new Player();
    }
  });
  socket.on("joystick", function(data){
    if(controllerSockets[socket.id]){
      console.log(controllerSockets[socket.id]);
      console.log(plyr[controllerSockets[socket.id]].v);
      plyr[controllerSockets[socket.id]].updateState(data.x, data.y);
    }else{
      disconnect(socket.id); // remove unregistered controller
    }
  });
  socket.on("requestSocketid", function(){
    io.to(socket.id).emit("returnSocketid", {
      socketid: socket.id,
      gmap: gmap.slice(0)
    });
  });
});
server.listen(process.env.PORT || 3000, '0.0.0.0', function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  console.log(`Running at ${(1e3/Math.round(1e3 / config.targetFrameRate)).toFixed(2)}FPS`);
});

setInterval(update, Math.round(1e3 / config.targetFrameRate));
