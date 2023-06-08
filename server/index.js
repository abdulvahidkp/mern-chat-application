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
app.listen(3000,()=>console.log(`server started on PORT ${PORT}`.yellow.bold));