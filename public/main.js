const socket = io()
const userbase = document.getElementById("clients-total")
const message = document.getElementById("message-container")
const nam = document.getElementById("name-input")
const form = document.getElementById("message-form")
const input = document.getElementById("message-input")

form.addEventListener('submit',(e) => {
    e.preventDefault()
    sendMessage()
})
socket.on('clients-total', (data) => {
    userbase.innerHTML = `User Base: ${data}`
})

function sendMessage() {
    console.log(input.value)
    const data = {
        name: nam.value,
        message: input.value,
        dateTime: new Date()
    }
    socket.emit('message', data)
}

socket.on('chat-message', (data) => {
    console.log(data)
})