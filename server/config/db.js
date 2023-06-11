const mongoose = require('mongoose');

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology:true
        })

        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold)
    } catch(error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
    
}

module.exports = connectDB