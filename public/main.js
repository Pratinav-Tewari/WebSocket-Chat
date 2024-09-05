const socket = io();
const clientsTotal = document.getElementById('user-base');
const Container = document.getElementById('message-container');
const namIn = document.getElementById('name-input');
const Form = document.getElementById('message-form');
const msgIn = document.getElementById('message-input');
const clearH = document.getElementById('clear-history');
const Tone = new Audio('/notification-tone.mp3');

Form.addEventListener('submit', (e) => {
    e.preventDefault();
    send();
});

socket.on('user-base', (data) => {
    clientsTotal.innerText = `User Base: ${data}`;
});

function send() {
    if (msgIn.value.trim() === '') { return; }
    const data = {
        name: namIn.value,
        message: msgIn.value,
        dateTime: new Date(),
    };
    socket.emit('message', data);
    addMessage(true, data);
    msgIn.value = '';
}

socket.on('chat-message', (data) => {
    Tone.play();
    addMessage(false, data);
});

function addMessage(isOwnMessage, data) {
    clearF();
    const element = `
      <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
          <p class="message">
            ${data.message}
            <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
          </p>
        </li>
        `;
        
    Container.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom() {
    Container.scrollTo(0, Container.scrollHeight);
}

let typeTime;  

msgIn.addEventListener('keypress', () => {
    clearTimeout(typeTime);

    if (namIn.value.trim() === '') { 
        return;
    }

    if (!socket.typing) {
        socket.typing = true; 
        socket.emit('feedback', {
            feedback: `${namIn.value} is typing a message`,
        });
    }

    typeTime = setTimeout(() => {
        socket.typing = false;  
        socket.emit('feedback', {
            feedback: '',  
        });
    }, 1000);
});

msgIn.addEventListener('focus', () => {
    socket.emit('feedback', {
        feedback: `${namIn.value} is typing a message`,
    });
});

msgIn.addEventListener('keypress', () => {
    socket.emit('feedback', {
        feedback: `${namIn.value} is typing a message`,
    });
});

msgIn.addEventListener('blur', () => {
    socket.emit('feedback', {
        feedback: '',
    });
});

socket.on('feedback', (data) => {
    clearF();
    const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
    `;
    Container.innerHTML += element;
});

function clearF() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
        element.parentNode.removeChild(element);
    });
}

socket.on('chat-history', (history) => {
    history.forEach(msg => {
        const data = {
            name: msg.user,
            message: msg.message,
            dateTime: msg.timestamp,
        };
        addMessage(false, data);
    });
});

clearH.addEventListener('click', () => {
  const user = namIn.value.trim();
  
  if (user === '') {
      console.error("User name blank.");
      alert("Enter username.");
      return;
  }

  fetch('/clear-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: user })
  })
  .then(res => res.json())
  .then(response => {
      if (response.success) {
          console.log("Chat cleared.");
          Container.innerHTML = '';
          alert(response.message);
      } else {
          console.error(response.message);
          alert(`Error: ${response.message}`);
      }
  })
  .catch(err => {
      console.error("Error clearing chat history:", err);
      alert("Error : unable to clear chat history.");
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  const element = `
    <li class="message-feedback">
      <p class="feedback" id="feedback">Connection lost. Reconnecting...</p>
    </li>
  `;
  Container.innerHTML += element;
});

socket.on('reconnect', () => {
  console.log('Reconnected to server');
  clearF();
  socket.emit('reconnected');
});

socket.on('pong', () => {
  console.log('Pong received from server');
  setTimeout(() => {
    if (!socket.connected) {
      console.log('Connection lost');
      const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">Connection lost. Reconnecting...</p>
        </li>
      `;
      Container.innerHTML += element;
    }
  }, 5000);
});

setInterval(() => {
  socket.emit('ping');
}, 5000);