const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Users = require('../MODELS/users.model')

const protect = asyncHandler(async(req,res,next)=>{
    if(req.headers.authorization?.startsWith('Bearer')){
        try {
            let token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
            req.user = await Users.findById(decoded._id).select('-password')
            if(!req.user) throw new Error('user is not found')
            next()
        } catch (error) {
            res.status(401)   
            throw new Error("Not authorized, token verification failed");
        }
    } else {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = {protect}