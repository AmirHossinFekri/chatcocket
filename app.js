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
        console.log(`${data} connected !`);
        onlineUser[socket.id]=data;
        console.log(onlineUser);
        io.sockets.emit('online',onlineUser);
    })
    socket.on("disconnect" , ()=>{
        console.log("user disconected !! ");
        delete onlineUser[socket.id];
        io.sockets.emit('online',onlineUser);
    });

    socket.on('chat massage',data=>{
        io.sockets.emit('chat massage',data);
    });
    
    socket.on('typing' ,data=>{
        socket.broadcast.emit("typing",data);
    })
});