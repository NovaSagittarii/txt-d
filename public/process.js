var socket = io();

var x = 0;
var y = 0;
var a = 0;
var v = 0;
var r = 0;
var plyrs = [];
var gmap = [];

function xyr($x, $y, $r){
  this.x = $x;
  this.y = $y;
  this.r = $r;
}

// updates current data to sync client with server
function update(data){
  x = data.self.x;
  y = data.self.y;
  a = data.self.a;
  v = data.self.v;
  r = data.self.r;
  const others = data.others;
  for(let i = 0; i < others.length; i ++){
    plyrs.push(Object.assign({}, others[i]));
  }
}
function alertSocketID(server){
  alert(server.socketid);
  gmap = server.gmap;
}

socket.emit('requestSocketid', {});
socket.on('returnSocketid', alertSocketID);
socket.on('dataBroadcast', update)

//initialize
/*function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  strokeCap(PROJECT);
  //socket = io.connect('https://47.147.17.164:3000', {secure: true});
  //socket = io.connect('http://47.147.17.164:3000');
  //socket = io.connect('http://myapp.herokuapp.com/');
  socket.on('update', update);
  socket.on('setConfig', updateConfig);
  socket.emit('requestConfig', name);
  for(var i = 0; i < sendable.length; i ++) keys[sendable[i]] = false;
}*/
