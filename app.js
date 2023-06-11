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

io.on('connection',socket=>{
    console.log('user connected ' , socket.id);

    socket.on("disconnect" , ()=>{
        console.log("user disconected !! ");
    });

    socket.on('chat massage',data=>{
        io.sockets.emit('chat massage',data);
    });
});