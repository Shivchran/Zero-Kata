# 🎮 Zero Kata

A real-time multiplayer **Zero Kata** game built using **HTML, CSS, JavaScript, Node.js, Express.js, and Socket.IO**.

Players can connect with each other and play the game in real time through a Socket.IO-powered server.

## 🚀 Live Demo

🔗 **Live Demo:** https://zero-kata-zuu3.onrender.com

## 📂 GitHub Repository

🔗 **GitHub:** https://github.com/Shivchran/Zero-Kata

---

## ✨ Features

* 🎮 Real-time multiplayer gameplay
* 🔄 Real-time player communication using Socket.IO
* 🧑‍🤝‍🧑 Multiplayer game support
* 🏆 Win detection
* 🤝 Draw detection
* 🔄 Game restart/reset functionality
* 📱 Responsive user interface
* ⚡ Fast client-server communication
* 🎨 Interactive game UI

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* Socket.IO

### Development Tools

* Git
* GitHub
* VS Code
* npm

---

## 📁 Project Structure

```text
zero-kata/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

> Your actual folder structure may be slightly different depending on how you created the project.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/shivchran/zero-kata.git
```

### 2. Open the project

```bash
cd zero-kata
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
node server.js
```

Or, if your `package.json` contains a start script:

```bash
npm start
```

### 5. Open in browser

```text
http://localhost:5000
```

> Use the port defined in your `server.js` if it is different from `5000`.

---

## 🔌 How Socket.IO Works

Zero Kata uses **Socket.IO** to provide real-time communication between players.

The basic flow is:

```text
Player 1
   │
   │ Game Move
   ▼
Socket.IO Server
   │
   │ Real-time Event
   ▼
Player 2
```

When one player makes a move, the server communicates the move to the other connected player so that both game boards stay synchronized.

---

## 🎮 How to Play

1. Open the game.
2. Connect with another player.
3. Start the game.
4. Players take turns making moves.
5. The game checks for a winning combination after each move.
6. The game displays the winner or draw result.
7. Start a new game using the restart option.

---

## 🧠 Main Concepts Used

This project helped implement practical concepts such as:

* DOM manipulation
* JavaScript event handling
* Game-state management
* Client-server communication
* WebSockets
* Socket.IO events
* Node.js server development
* Express.js
* Responsive UI design

---

## 📸 Screenshots

<img width="1365" height="658" alt="image" src="https://github.com/user-attachments/assets/61a1525f-b2d6-4a12-a635-dcc48371cef6" />
<img width="1365" height="680" alt="image" src="https://github.com/user-attachments/assets/8aa20dfd-feb4-4235-9248-1fc00c4316e1" />



```text
![Zero Kata Game]
```

---

## 🔮 Future Improvements

Possible future features:

* 🤖 AI opponent
* 🌐 Online room creation
* 🔐 Private game rooms
* 💬 In-game chat
* 🏆 Player score system
* 👤 Player profiles
* 📊 Game history
* 📱 Improved mobile experience
* 🔊 Sound effects
* ✨ Advanced animations

---

## 👨‍💻 Author

**SACHIN UPMANYU**

Frontend Developer | MCA Student

### Skills

HTML • CSS • JavaScript • React.js • Node.js • Socket.IO

---

## ⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub.
