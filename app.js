var express = require('express');
var mongoose = require('mongoose');
var app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
ent = require('ent'),
fs = require('fs');
var User = require("./public/Model/userSchema");
var config = require('./public/Config/database');
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');
var salt = "wacsalt";
var Cookies = require( "cookies" );


mongoose.connect(config.database);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/register', function (req, res) {
  res.sendFile(__dirname + '/register.html');
});

app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.post('/register', function (req, res) {
    if (!req.body.username || !req.body.password){
        res.json('Il manque un champ');
    }
    else{

        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            role: req.body.role
        });

        newUser.save(function(err) {
            if (err)
                return res.json({success: false, msg: err.message});
            else {
                res.json({success: true, msg: 'Sauvegarde réussi'});
            }
        });
    }
});

app.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password ) {
        res.json('il manque un champ');
    }
    else{
        User.findOne({
            username: req.body.username,
            password: req.body.password
        }, function(err, user){
            if (user) {
                var token = jwt.sign({user}  , salt ,{ expiresIn: 604800 });
                res.json({status:"find", token:token});
            }
            else{
                console.log("User not found")
            }
        })
    }
});

app.post('/log', function (req, res) {
    var user = jwt.decode(req.body.token, salt);
    if (user) {
        var username = user.user.username;
        res.json(username);
    }
    else {
        console.log("error JWT");
    }
});

io.use(function(socket, next){
    var user = jwt.decode(socket.handshake.query.token, salt);
    socket.user = user.user;
    if(user && user.user)
        next();

});
var sockets = [];

io.sockets.on('connection', function (socket) {
    console.log(socket.user.username, " is connected.");
    socket.broadcast.emit('nouveau_client', socket.user.username);
    
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.user.username, message: message});
    }); 
});


server.listen(8080);