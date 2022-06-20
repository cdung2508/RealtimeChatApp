window.onload = function() {
    var messages = [];
    var socket = io.connect('http://localhost:3000')
    var name = prompt('Enter a username:')
    while (name === '' || name === null) {
        name = prompt('Enter your name:')
    }
    var field = document.getElementById('field')
    var sendButton = document.getElementById('send')
    var content = document.getElementById('content')
    var account = document.getElementsByClassName('username')[0]
    var counterUser = document.getElementById('counterUser')
    
    account.innerHTML += name

    socket.emit('join', {name: name})

    
    socket.on('join', (data, counter) => {
        if (data) {
            var join = '<i>' + data.name + ' has joined the chat! </i><br>'
            var showJoin = document.getElementById('showjoin');
            showJoin.innerHTML = join
            showJoin.style.opacity = '1';
            
            setTimeout(() => {
                showJoin.style.opacity = '0';
            }, 5000)
        }
        counterUser.innerText = 'Online: ' + counter
    })
    
    socket.on('message', (data, counter) => {
        if (data === 'transport close') {
            var showLeft = document.getElementById('showjoin');
            showLeft.innerHTML = 'Someone has left the chat.'
            showLeft.style.opacity = '1';
            
            setTimeout(() => {
                showLeft.style.opacity = '0';
            }, 5000)
            counterUser.innerText = 'Online: ' + counter
        }
        else if (data.message) {
            messages.push(data)
            var html = ''
            for (var i = 0; i < messages.length; i++) {
                html += '<b>' + (!messages[i].username ? messages[i].username = 'Server' : messages[i].username) + ': </b>'
                html += messages[i].message + '<br>'
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight
        } else {
            console.log('Error!')
        }
    })


    sendButton.onclick = () => {
        var text = field.value;
        socket.emit('send', {message: text, username: name})
        field.value = ''
    }

    field.addEventListener('keypress', (e) => {
        var key = e.which || e.keyCode;
        if (key == 13) {
            sendButton.onclick();
        }
    })

    
}


