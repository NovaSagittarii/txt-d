const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

http.listen(3000, '0.0.0.0', function(){
  console.log('listening on *:3000');
});
