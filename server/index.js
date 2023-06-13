const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv/config')
require('colors')
const data = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./ROUTES/user.routes');
const chatRoutes = require('./ROUTES/chat.routes')
const messageRoutes = require('./ROUTES/message.routes')
const {notFound, errorHandler} = require('./MIDDLEWARES/error.middleware')

connectDB();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
const server = app.listen(3000,()=>console.log(`server started on PORT ${PORT}`.yellow.bold));

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:process.env.CLIENT
    }
})

io.on('connection',(socket) => {
    console.log(`connected to socket.io ${socket.id}`)

    socket.on('setup',(userData) => {
        socket.join(userData._id)
        socket.emit('connected')
    })

    socket.on('join room',room => {
        console.log('joining rom',room)
        socket.join(room)
    })

    socket.on('leave room',room => {
        console.log('leaving from room:',room)
        socket.leave(room)
    })

    socket.on('new message',(newMessage) => {
        var chat = newMessage.chat
        if (!chat.users) return console.log('chat.users is not defined')
        chat.users.forEach(user => {
            socket.to(user._id).emit('new message',newMessage)
        })
        // socket.to(room).emit('new message',newMessage)
    })

    socket.on('typing', (room) => {
        socket.to(room).emit('typing')
    })

    socket.on('stop typing', (room) => {
        socket.to(room).emit('stop typing')
    })

    socket.off('setup',()=> {
        console.log('user leave succefully')
        socket.leave(userData._id)
    })

    socket.on('disconnect',()=>{
        console.log('disconnected')
    })
});