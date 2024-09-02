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
    addMessage(true, data)
    input.value = ''
}

socket.on('chat-message', (data) => {
    addMessage(false, data)
})

function addMessage(isOwnMessage, data){
    const element = `<l1 class="${isOwnMessage ? "message-right" : "message-left"}">
    <p class="message">
        ${data.message}
        <span>${moment(data.dateTime).fromNow()}</span>
    </p>
</l1>`

message.innerHTML += element
}