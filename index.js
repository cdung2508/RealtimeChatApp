// This is setup to run in localhost

const express = require('express');
const path = require('path')
const app = express();
var server_port = 5000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('page')
})

var midPort = app.listen(server_port, () => {
    console.log(`On port ${server_port}`)
})

const io = require('socket.io').listen(midPort);

io.sockets.on('connection', function(socket) {
    
    socket.on('join', (data) => {
        let counter = Object.keys(io.sockets.connected).length
        io.sockets.emit('join', data, counter)
    })

    socket.on('send', function(data) {
        io.sockets.emit('message', data)
    })

    socket.on('disconnect', (data) => {
        let counter = Object.keys(io.sockets.connected).length
        io.sockets.emit('message', data, counter)
    })   
})



