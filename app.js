var port = 80;

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

var session = require("express-session");
app.use(session({
    secret: '##SECRET##',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname + '/public_html');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/static', express.static("static"));
app.use('/auth', require("./routes/auth"));
app.use('/buzzer', require("./routes/buzzer"));
app.use('/admin', require("./routes/admin"));

app.get('/', function(req, res) {
    res.redirect("/buzzer");
});

var socket_ids = [];
var winner;
var start = false;

io.on('connection', function(socket) {

    socket.on("init", function(data) {
        socket_ids.push(socket.id);

        socket.idx = data.idx;
        socket.name = data.name;

        response = [];
        for (i = 0; i < socket_ids.length; i++) {
            response.push(getSocketInfo(io.sockets.sockets, socket_ids[i]));
        }
        io.emit("update_users", response);
        io.emit("update_status", {"clicked": (winner !== undefined || !start)});
    });

    socket.on("disconnect", function() {
        for (i = 0; i < socket_ids.length; i++) {
            if (socket_ids[i] == socket.id) break;
        }
        socket_ids.splice(i, 1);

        response = [];
        for (i = 0; i < socket_ids.length; i++) {
            response.push(getSocketInfo(io.sockets.sockets, socket_ids[i]));
        }
        io.emit("update_users", response);

        if (winner !== undefined && winner == socket.id) {
            winner = undefined;
        }
        io.emit("update_winner", getSocketInfo(io.sockets.sockets, winner));
        io.emit("update_status", {"clicked": (winner !== undefined || !start)});
    });

    socket.on("init_users", function(data) {
        response = [];
        for (i = 0; i < socket_ids.length; i++) {
            response.push(getSocketInfo(io.sockets.sockets, socket_ids[i]));
        }
        io.emit("update_users", response);
    });

    socket.on("init_winner", function(data) {
        io.emit("update_winner", getSocketInfo(io.sockets.sockets, winner));
    });

    socket.on("buzzer", function(data) {
        if (start) {
            if (winner === undefined) {
                winner = socket.id;
            }
            io.emit("update_winner", getSocketInfo(io.sockets.sockets, winner));
            io.emit("update_status", {"clicked": (winner !== undefined || !start)});
        } else {
            //asdf
        }
    });

    socket.on("resume", function() {
        start = true;
        io.emit("update_status", {"clicked": (winner !== undefined || !start)});
    });
    socket.on("stop", function() {
        start = false;
        io.emit("update_status", {"clicked": (winner !== undefined || !start)});
    });
    socket.on("reset", function(data) {
        start = false;
        winner = undefined;
        io.emit("update_winner", getSocketInfo(io.sockets.sockets, winner));
        io.emit("update_status", {"clicked": (winner !== undefined || !start)});
    });
});

function getSocketInfo(sockets, id) {
    if (id === undefined) {
        return undefined;
    } else {
        var socket = sockets[id];
        return {"id": socket.id, "idx": socket.idx, "name": socket.name};
    }
}

server.listen(port, function() {
    console.log('Socket IO server listening on port ' + port);
});
