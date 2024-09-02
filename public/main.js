const socket = io()
const userbase = document.getElementById("clients-total")
socket.on('clients-total', (data) => {
    userbase.innerHTML = `User Base: ${data}`
})