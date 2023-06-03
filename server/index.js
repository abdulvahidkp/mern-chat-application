const express = require('express');
const app = express();
require('dotenv/config')
require('colors')
const data = require('./data/data')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res) => res.send('<h1>Hello worldddd!</h1>'))

app.get('/api/chat',(req,res) => res.send(data))

app.get('/api/chat/:id',(req,res)=> {
    const {id} = req.params
    const chat = data.find(chat => chat._id === id)
    res.send(chat)
})

const PORT = process.env.PORT || 3000
app.listen(3000,()=>console.log(`server started on PORT ${PORT}`.yellow.bold));