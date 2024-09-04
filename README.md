# Basic WebSocket Chat Application

## Introduction

This is a real-time chat application built using Node.js, Express, Socket.io, and SQLite. The app allows multiple users to communicate in real-time through WebSockets. All chats are stored in a SQLite3 database which can easily be cleared by the user whenever they desire. The front end is designed with HTML5, CSS3, and JavaScript, ensuring a responsive and user-friendly interface.

## Features

- **Real-time Communication**: Users can send and receive messages instantly.
- **Message History**: Chat history is stored in an SQLite database and retrieved when a user connects.
- **Typing Notifications**: Users can see when others are typing hence inducing responsive feedback.
- **Responsive Design**: The interface is designed to be accessible and usable on various devices.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for Node.js.
- **Socket.io**: Library for real-time web applications.
- **SQLite3**: Lightweight database for storing chat messages.
- **bcrypt**: Library for hashing passwords.
- **HTML5 & CSS3**: Front-end structure and styling.
- **JavaScript**: Front-end logic and interactivity.

## Installation

Follow these steps to set up the application:

### Step 1: Install Express and Socket.io

Open your terminal, navigate to the project directory, and run:

```bash
npm install --save express socket.io
```

### Step 2: Install SQLite3 for the Database

Next, install SQLite3 to handle the chat message storage:

```bash
npm install sqlite3
```

### Step 3: Install bcrypt for Authentication

To enable user authentication, install bcrypt and express-session:

```bash
npm install bcrypt express-session
```

### Step 4: Start the Application

Once all dependencies are installed, start the server by running:

```bash
npm start
```

### Step 5: Access the Application

Open your browser and navigate to:

[http://localhost:4000/](http://localhost:4000/)

## Usage

- Enter your username and start sending messages in real-time.
- The app will show the number of users connected, and you can clear the chat history if needed.
- If you lose connection, the app will automatically attempt to reconnect.

## Deployment

Glitch - [https://pvt-websocket-chat.glitch.me/](Open_In_Two_Tabs)
