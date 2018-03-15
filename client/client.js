document.addEventListener("DOMContentLoaded", function() {
   var mouse = { 
       click: false,
       move: false,
       pos: {x:0, y:0},
       pos_prev: false
    };
   
    var canvas  = document.getElementById('drawing');
    var context = canvas.getContext('2d');
  
    var width   = window.innerWidth;
    var height  = window.innerHeight;
    var socket  = io.connect();

    canvas.width = width;
    canvas.height = height;

    canvas.onmousedown = function(e){ mouse.click = true; };
    canvas.onmouseup = function(e){ mouse.click = false; };

    canvas.onmousemove = function(e) {
        mouse.pos.x = e.clientX / width;
        mouse.pos.y = e.clientY / height;
        mouse.move = true;
    };

    socket.on('erase', function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

	socket.on('draw_line', function (data) {
        var line = data.line;
        context.beginPath();
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
    });

    document.getElementById('clear').addEventListener('click', function() {
        var canvas  = document.getElementById('drawing');
        var context = canvas.getContext('2d');
        socket.emit('erase');
        socket.on('erase', function(data) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        });
    }, false);
   
    function mainLoop() {
        if (mouse.click && mouse.move && mouse.pos_prev) {
            socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
            mouse.move = false;
        }
        mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
        setTimeout(mainLoop, 25);
   }
   mainLoop();

   function dlCanvas() {
        var dt = canvas.toDataURL('image/png');
        /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
        dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

        /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
        dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');

        this.href = dt;
   };

   document.getElementById("dl").addEventListener('click', dlCanvas, false);
});

