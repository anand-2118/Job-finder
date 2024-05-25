const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const registerUser = async(req,res)=>{

    try{
        const {name,email,mobile,password} = req.body;
        if(!name || !email || !mobile || !password){
            return res.status(400).send("please fill all the fields");
        }
    
        const isUserExist = (await User.findOne({email})) || (await User.findOne({mobile}));
        if (isUserExist){
            return res.status(400).send("user already exists")
        }
    
        const hashedPassword = await bcrypt.hash(password,10);
    
        const newUser = new User({
            name,
            email,
            mobile,
            password:hashedPassword, 
        });
        await newUser.save();
        res.status(201).send('user registed successfully')
    }catch{
        next(err)
    }
    
};
const loginUser = async(req,res)=>{
    try{
       const {email,password } = req.body;
       if(!email || !password){
        return res.staus(400).send("please fill all the details")
       }

       const user = await User.findOne({email});
       if(!user){
        return res.status(400).send("invalid  email or password")
       }
       const isPasswordvalid = await bcrypt.compare(password,user.password);
       if(!isPasswordvalid){
          return res.status(400).send("invalid or email or password");
       }

       const token = jwt.sign({userId: user.__id},"secret",{
        expiresIn:"240h",
       })
       res.status(200).json({
        token,
        userId:user.__id,
        name:user.name,
        email:user.email,
        mobile:user.mobile,
       });
    }catch (err){
        next(err);
    }
}

const allUsers = async (req,res,next)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).send("please fill all the deatils");

        }
        if(email==="admin@backend.com" &&  password === "admin"){
            const users = await User.find();
            return res.status(200).json(users);
        }
        else{
            return res.status(400).send("invalid email or password");
        }
    } catch(err){
        next(err);
    }
}

module.exports={registerUser,loginUser,allUsers};