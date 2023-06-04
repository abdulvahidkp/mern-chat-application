const Users = require('../MODELS/users.model')
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken')

const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password,pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error('Please Enter all the Fields')
    };

    const userExists = await Users.findOne({email});
    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await Users.create({
        name,
        email,
        password,
        pic
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        }) 
    } else {
        res.status(400)
        throw new Error('Failed to create the user')
    }
})

const authUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body;
    if(!email || !password) {
        res.status(400)
        throw new Error("Please Enter all the Fields")
    }

    const user = await Users.findOne({email})
    if(user && (await user.matchPassword(password))){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid Email or Password");  
    }
})

const allUsers = asyncHandler(async(req,res)=>{
    const keyword = req.query.search ? 
    {
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ]
    } : {}
    const users = await Users.find(keyword).find({_id:{$ne:req.user._id}});
    res.status(200).json(users);
})


module.exports = {registerUser, authUser, allUsers};