const express = require('express')
const path = require('path')
const { Socket } = require('socket.io')
const app = express()
const PORT = process.env.PORT || 3000
const server = app.listen(PORT,() => console.log(`chat server on ${PORT}`))
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
let socketsConnected = new Set()
io.on('connection', onConnect)

function onConnect(socket) {
    console.log(socket.id)
    socketsConnected.add(socket.id)
    io.emit('clients-total', socketsConnected.size)
    socket.on('disconnect', () =>{
        console.log('Socket Disconnected', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)

    })
}