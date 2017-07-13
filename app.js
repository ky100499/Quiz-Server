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
var rank = [];

io.on('connection', function(socket) {

    socket.on("init", function(data) {
        socket_ids.push(socket.id);

        socket.idx = data.idx;
        socket.name = data.name;

        // console.log(socket_ids);

        response = [];
        for (i = 0; i < socket_ids.length; i++) {
            response.push(getSocketInfo(io.sockets.sockets, socket_ids[i]));
        }
        io.emit("update_users", response);
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
    });

    socket.on("init_users", function(data) {
        response = [];
        for (i = 0; i < socket_ids.length; i++) {
            response.push(getSocketInfo(io.sockets.sockets, socket_ids[i]));
        }
        io.emit("update_users", response);
    });

    socket.on("init_rank", function(data) {
        response = [];
        for (i = 0; i < rank.length; i++) {
            response.push(getSocketInfo(io.sockets.sockets, rank[i]));
        }
        io.emit("update_rank", response);
    });

    socket.on("buzzer", function(data) {
        for (i = 0; i < rank.length; i++) {
            if (rank[i] == socket.id) break;
        }
        if (i == rank.length) rank.push(socket.id);

        response = [];
        for (i = 0; i < rank.length; i++) {
            response.push(getSocketInfo(io.sockets.sockets, rank[i]));
        }
        io.emit("update_rank", response);
    });

    socket.on("reset", function(data) {
        rank = [];
        io.emit("update_rank", []);
    });
});

function getSocketInfo(sockets, id) {
    var socket = sockets[id];
    return {"id": socket.id, "idx": socket.idx, "name": socket.name};
}

server.listen(port, function() {
    console.log('Socket IO server listening on port ' + port);
});
