const socket = io()

const clientsTotal = document.getElementById('user-base')

const Container = document.getElementById('message-container')
const namIn = document.getElementById('name-input')
const Form = document.getElementById('message-form')
const msgIn = document.getElementById('message-input')

const Tone = new Audio('/notification-tone.mp3')

Form.addEventListener('submit', (e) => {
  e.preventDefault()
  send()
})

socket.on('user-base', (data) => {
  clientsTotal.innerText = `User Base: ${data}`
})

function send() {
  if (msgIn.value === '') return
  const data = {
    name: namIn.value,
    message: msgIn.value,
    dateTime: new Date(),
  }
  socket.emit('message', data)
  addMessage(true, data)
  msgIn.value = ''
}

socket.on('chat-message', (data) => {
  Tone.play()
  addMessage(false, data)
})

function addMessage(isOwnMessage, data) {
  clearF()
  const element = `
      <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
          <p class="message">
            ${data.message}
            <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
          </p>
        </li>
        `

  Container.innerHTML += element
  scrollToBottom()
}

function scrollToBottom() {
  Container.scrollTo(0, Container.scrollHeight)
}

msgIn.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    feedback: `${namIn.value} is typing a message`,
  })
})

msgIn.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    feedback: `${namIn.value} is typing a message`,
  })
})
msgIn.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: '',
  })
})

socket.on('feedback', (data) => {
  clearF()
  const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `
  Container.innerHTML += element
})

function clearF() {
  document.querySelectorAll('li.message-feedback').forEach((element) => {
    element.parentNode.removeChild(element)
  })
}