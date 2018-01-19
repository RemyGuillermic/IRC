//Sur la page de Login le cookie est supprimé

$(document).ready(function() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});

function login() {
    $.post( "/login", { username: $("#username").val(), password:$("#password").val() }, function( data ) {
        token = data.token;
        console.log(token);
        setCookie("token",data.token,1);
        window.location.href = "http://localhost:8080/";
    }, "json");
    return false;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

