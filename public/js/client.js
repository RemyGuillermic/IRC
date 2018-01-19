// Connexion à socket.io
var token = null;
checkCookie();
var socket = null;
var login = null;
function socketHandler(user, token) {
    socket = io.connect('http://localhost:8080', {query:"token=" + token});
    document.title = user + ' - ' + document.title;
    login = user;
    
    socket.on('message', function(data) {
        insereMessage(data.pseudo, data.message)
    });

    socket.on('nouveau_client', function(pseudo) {
        $('#zone_chat').prepend('<p><em>' + pseudo + ' a rejoint le Chat !</em></p>');
    });
}


$('#formulaire_chat').submit(function () {
    var message = $('#message').val();
    if (!commande(message)) {
        socket.emit('message', message);
        insereMessage(login, message);
        $('#message').val('').focus(); 
    }
    else {
        $('#message').val('').focus(); 
    }
    return false; 
});

function insereMessage(pseudo, message) {
    $('#zone_chat').prepend('<p><strong>' + pseudo + '</strong> ' + message + '</p>');
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var token = getCookie("token");
    if (!token) {
        window.location.href = "http://localhost:8080/login";
    }
    else
        tokenCheck(token);
    return token;
}

function tokenCheck(token) {
    $.post("/log", {'token': token},function (user) {
        if(user)
            socketHandler(user, token);
        else
            console.log("error, token failed");
    });
}

function commande (message) {

    var listCmd = ["/nick", "/list", "/join", "part", "users", "/msg","/beer"];
    var explode = message.split(" ");

    if (listCmd.includes(explode[0])) {
        if (explode[0] == "/nick" && explode[1]) {
            login = explode[1];

        }

        if (explode[0] == "/part") {
            socket.disconnect();
        }


        if (explode[0] == "/beer") {
            message = $('#message').val() + "Hic!";
            console.log(message);
            socket.emit('message', message);
            insereMessage(login, message); 

            return true;
        }


        return true;
    }
    return false;
}