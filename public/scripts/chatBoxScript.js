var socket = io();
$(function () {
    var arrow = $('.chat-head img');
    var textarea = $('.chat-text input');

    arrow.on('click', function () {
        var src = arrow.attr('src');

        $('.chat-body').slideToggle('fast');
        if (src == 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png') {
            arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_up-16.png');
        } else {
            arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png');
        }
    });

    textarea.keypress(function (event) {
        var $this = $(this);
        var nick= $('#nick').val();        
        var msg = $this.val();
        if (nick == '') {
            alert('Inserisci un nickname per chattare');
            return;
        }
        if (msg == '') return;
        socket.emit('typing', nick);
        if (event.keyCode == 13) {
            $this.val('');
            socket.emit('chat', {
                message: msg,
                handle: nick,
            });
        }
    });

    //Listen for events
    socket.on('chat', function (data) {
        $('#feedback').html('');
        if (data.handle != $('#nick').val()) {
            $('.msg-insert').prepend("<span><div class='msg-receive'>" + '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>' + "</div></span>");
        }
        else $('.msg-insert').prepend("<span><div class='msg-send'>" + '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>' + "</div></span>");
    });

    socket.on('typing', function (data) {
        $('#feedback').html('<p><em>' + data + ' sta scrivendo ...</em></p>');
    });
});