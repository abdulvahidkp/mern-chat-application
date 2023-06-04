const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv/config')
require('colors')
const data = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./ROUTES/userRoutes');
const {notFound, errorHandler} = require('./MIDDLEWARES/error.middleware')

connectDB();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())

app.get('/api/chat',(req,res) =>{
    res.send(data)
})

app.get('/api/chat/:id',(req,res)=> {
    const chat = data.find(chat => chat._id === req.params.id)
    res.send(chat)  
}) 

app.use('/api/user',userRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(3000,()=>console.log(`server started on PORT ${PORT}`.yellow.bold));