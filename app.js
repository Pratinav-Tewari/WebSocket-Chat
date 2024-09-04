const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); 
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Chat server on port ${PORT}`));
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

let usersConnected = new Set();

const db = new sqlite3.Database('./chat.db');  

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS chat (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
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
    });

    socket.on('message', (data) => {
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
        socket.broadcast.emit('feedback', data);
    });
}

app.post('/clear-history', (req, res) => {
    db.run(`DELETE FROM chat`, [], function(err) {
      if (err) {
        return 0;
      }
      io.emit('clear-history'); 
      res.status(200).send({ success: true });
    });
  });