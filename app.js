const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); 
const app = express();
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Chat server on port ${PORT}`));
const io = require('socket.io')(server);
const db = new sqlite3.Database('./chat.db');  

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 

app.get('/register', (req,res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'));
})

app.get('/login', (req,res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
})

let usersConnected = new Set();

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS chat (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

db.run("DELETE FROM chat WHERE id NOT IN (SELECT id FROM chat ORDER BY timestamp DESC LIMIT 100)", function(err) {
  if (err) {
      console.error("Error deleting old messages:", err.message);
  }
});

io.on('connection', connection);

function connection(socket) {
    console.log('Socket connected', socket.id);
    usersConnected.add(socket.id);
    io.emit('user-base', usersConnected.size);

    db.all("SELECT * FROM chat", [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        socket.emit('chat-history', rows);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
        usersConnected.delete(socket.id);
        io.emit('user-base', usersConnected.size);
        socket.broadcast.emit('user-disconnected', socket.id);
    });
  
    socket.on('reconnect', () => {
        console.log('Socket reconnected', socket.id);
        usersConnected.add(socket.id);
        io.emit('user-base', usersConnected.size);
        socket.emit('reconnected');
    });
    
    socket.on('ping', () => {
        socket.emit('pong');
    });

    socket.on('message', (data) => {
        if (data.message.trim() === ' ') { return; }
        const stmt = db.prepare("INSERT INTO chat (user, message) VALUES (?, ?)");
        stmt.run(data.name, data.message, function(err) {
            if (err) {
                console.error(err.message);
                return;
            }
            socket.broadcast.emit('chat-message', data);
        });
        stmt.finalize();
    });

    socket.on('feedback', (data) => {
      if (data.feedback && typeof data.feedback === 'string' && data.feedback.length > 0) {
          socket.broadcast.emit('feedback', data);  
      }
  });
}

app.post('/clear-history', (req, res) => {
  const user = req.body.user; 
  if (!user) {
      return res.status(400).send({ success: false, message: 'User not provided.' });
  }
  
  db.run(`DELETE FROM chat WHERE user = ?`, [user], function(err) {
      if (err) {
          return res.status(500).send({ success: false, message: 'Failed to clear chat.' });
      }
      console.log(`Chat history for "${user}" is cleared.`);
      res.status(200).send({ success: true, message: `${user}'s chat history has been cleared.` });
  });
});