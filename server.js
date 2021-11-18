const express = require('express');
const path = require('path');
const http = require('http');
const formatmessage = require('./utils/message');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');

//create apps
const app = express();
const server = http.createServer(app)
const socketio = require('socket.io');
const io = socketio(server);

//set static folder path
app.use(express.static(path.join(__dirname,'public')));

//on Running io when client connect
io.on('connection',socket =>{
    socket.on('joinRoom',({username,room}) =>{
        const user = userJoin(socket.id, username,room);

        socket.join(user.room);

        socket.emit('message',formatmessage('bot',`Hey  '${user.username}' 👋 Welcome to ${user.room} Group`));

        //Broadcast message to all user in char room when new user connects
        socket.broadcast.to(user.room).emit('message',formatmessage('bot',`${user.username} has joined the chat `));
        
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
    });
    
    socket.on('disconnect' ,() =>{
        const user1 = userLeave(socket.id);
        if(user1){
            io.to(user1.room).emit('message',formatmessage('bot',`${user1.username} has left the chat`));
            io.to(user1.room).emit('roomUsers',({room:user1.room,users:getRoomUsers(user1.room)}));
            
        }
    });

    //catch the client message
    socket.on('chatmsg',(msg) =>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatmessage(user.username,msg));
    })
});
//Assign port and listing app
const PORT =process.env.PORT ||3000;
server.listen(PORT,() => console.log(`Server Running on ${PORT} `));
