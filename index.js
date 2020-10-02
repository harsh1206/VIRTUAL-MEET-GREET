const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/user");

const expressLayouts = require('express-ejs-layouts');



const app = express();
const server = http.createServer(app);
const io = socketio(server);

// const express = require("express");
const port = process.env.PORT || '3000';

// const app = express();
// const http = require('http');
// const socketio = require("socket.io");
// const server = http.createServer(app);
// const io = socketio(server);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');



const botName = "ViMeet Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ViMeet !"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

   
    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  
  // For start Questions
  socket.on("start",(question)=>{
     
    const user = getCurrentUser(socket.id);
    
    io.to(user.room).emit(
      "message",
      formatMessage(botName, `You have a new question`)
    );

    // Send users and room info
    io.to(user.room).emit('Start_Session',question);

  })
  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});



// using static files
app.use(express.static("assets"));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);




// use express router
app.use('/', require('./routes'));

server.listen(port, function (err) {
  
    if(err) {
       console.log("error in starting the server");
       return;
    }

     console.log("server started on port ");
});


