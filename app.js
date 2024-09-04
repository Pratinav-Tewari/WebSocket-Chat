const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`Chat server on port ${PORT}`))

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

let usersConected = new Set()

io.on('connection', conection)

function conection(socket) {
  console.log('Socket connected', socket.id)
  usersConected.add(socket.id)
  io.emit('user-base', usersConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    usersConected.delete(socket.id)
    io.emit('user-base', usersConected.size)
  })

  socket.on('message', (data) => {
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}
