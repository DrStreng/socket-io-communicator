/* jshint browser: true, globalstrict: true, devel: true */
/* global io: false, $: false */
"use strict";

// Inicjalizacja
$(function () {
    var status = $("#status");
    var open = $("#open");
    var close = $("#close");
    var send = $("#send");
    var text = $("#text");
    var message = $("#message");
    var name =$("#name");
    var nameerror=$(".errorek");
    var socket;
    var zatwierdz =$("#zatwierdz");
    status.html( "Brak połącznia" );

    close.prop("disabled",true);
    zatwierdz.prop("disabled",true);
    name.prop("disabled",true);
    send.prop("disabled",true);
    text.prop("disabled",true);
    open.prop("disabled",false);

open.click(function () {
    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }

    // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
    zatwierdz.click(function () {
        if(name.val() !== ""){
          socket.emit('new user', name.val(), function(data){
  					if(data){
              close.prop("disabled",false);
              zatwierdz.prop("disabled",true);
              name.prop("disabled",true);
              send.prop("disabled",false);
              text.prop("disabled",false);
              open.prop("disabled",true);
              socket.emit('message', name.val() +": Polaczyl sie do kanalu");
              nameerror.html('');
  					} else{
  						nameerror.html('ten user jest wykorzystany');
  					}
  				});
      }else{
        nameerror.html("wpisz usera");
      }
    });

    socket.on('connect', function () {
        status.attr('src', "img/bullet_green.png");
        console.log('Nawiązano połączenie przez Socket.io');
        close.prop("disabled",false);
        zatwierdz.prop("disabled",false);
        name.prop("disabled",false);
        send.prop("disabled",true);
        text.prop("disabled",true);
        open.prop("disabled",true);

    });

    socket.on("error", function (err) {
        message.html( "Błąd połączenia z serwerem: '" + JSON.stringify(err) + "'" );
    });
    socket.on("username", function (data) {
        message.append("<p>"+ data +"</p>");
    });

    //Zamknij połączenie po kliknięciu guzika „Rozłącz”
    close.click(function () {
        socket.emit('message', name.val() +": rozlaczyl sie");
        message.html("");
        socket.io.disconnect();
        console.dir(socket);
    });

    // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
    send.click(function () {
        socket.emit('message', name.val() +": "+ text.val());
        console.log('Wysłałem wiadomość: ' + text.val());
        text.val ("");
    });
    socket.on('disconnect', function () {
        status.attr('src', "img/bullet_red.png");
        console.log('Połączenie przez Socket.io zostało zakończone');
        close.prop("disabled",true);
        zatwierdz.prop("disabled",true);
        name.prop("disabled",true);
        send.prop("disabled",true);
        text.prop("disabled",true);
        open.prop("disabled",false);
    });
  });
});
