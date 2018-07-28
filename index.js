const express = require('express');
const app = express();
const http = require('http');
const io = require('socket.io')(http);
const server = http.createServer(app);

app.use(express.static('./public'));

server.listen(process.env.PORT || 3000, '0.0.0.0', function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  //console.log(`Running at ${(1e3/Math.round(1e3 / config.targetFrameRate)).toFixed(2)}FPS`);
});
