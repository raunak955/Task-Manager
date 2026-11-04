const express = require("express")
const bcrypt = require("bcryptjs");
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const router = express.Router();

//signup API
router.post("/signup", async(req,res) =>{
  try {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    
    // check existing user
    const existingUser = await User.findOne({email});

    if(existingUser){
      return res.status(400).json({
        message: "user already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password,10);

    // create user
    const user = await User.create({
      name,
      email, 
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      error: error.message
    })
  }
})

//login API
router.post("/login", async(req,res) =>{
  try {
    
    const {email, password} = req.body;

    // check empty fields
  if(!email || !password){
    return res.status(400).json({
      message: "Email and password are required"
    });
    }

    // find user
    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({
        message: "User not found"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    // generate JWT token
    const token = jwt.sign(
      {id: user._id},process.env.JWT_SECRET,
      {expiresIn: "1d"}
    );


    // send response
    res.status(200).json({
      message: "Login successful",
      token,
      user:{
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
    } catch (error) {
    res.status(500).json({
      message:"Server Error",
      error: error.message
    })
  }
})

module.exports = router;