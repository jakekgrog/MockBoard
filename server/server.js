var express = require('express'), 
    app = express(),
    http = require('http'),
    io = require('socket.io');

var server = http.createServer(app);
var io = require('socket.io')(server);
var path = require('path');

server.listen(8080);
app.use(express.static(path.resolve(__dirname + '/../client')));
console.log("Server running on 127.0.0.1:8080");

var line_history = [];

io.on('connection', function (socket) {

   for (var i in line_history) {
      socket.emit('draw_line', { line: line_history[i] } );
   }

   socket.on('draw_line', function (data) {
      line_history.push(data.line);
      io.emit('draw_line', { line: data.line });
   });

   socket.on('erase', function(){
     line_history = [];
     io.emit('erase');
   })
});