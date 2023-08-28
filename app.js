import http from 'http';

import express from "express";
import {Server}  from "socket.io";

const app=express();
const server=http.createServer(app);
const io = new Server(server);
app.use(express.static("public"));

const PORT = process.env.PORT||3000;

server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});
const onlineUser={};

io.on('connection',socket=>{

    socket.on('login',data=>{
        console.log(`${data.nickname} connected with id : ${socket.id}`);
        socket.join(data.roomNumber)
        console.log(data.roomNumber);
        onlineUser[socket.id]={nickname:data.nickname,roomNumber:data.roomNumber};
        io.sockets.emit('online',onlineUser);
    })
    socket.on("disconnect" , ()=>{
        console.log("user disconected !! ");
        delete onlineUser[socket.id];
        io.sockets.emit('online',onlineUser);
    });

    socket.on('chat massage',data=>{
        io.to(data.roomNumber).emit('chat massage',data);
    });
    
    socket.on('typing' ,data=>{
        socket.broadcast.emit("typing",data);
    });

    socket.on('pvChat',data=>{
        console.log(data);
        io.to(data.to).emit('pvChat',data);
    });
});