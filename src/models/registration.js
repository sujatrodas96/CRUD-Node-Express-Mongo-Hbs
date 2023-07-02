const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeschema = new mongoose.Schema({

    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    confirmpassword:{
        type:String,
        required:true,
        unique:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
        
    }],
})

employeschema.methods.generatetoken = async function()
{
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, "mynameissujatrodasnodedevelopers");
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(error){
        res.send("the error part is:" + error);
        console.log("the error part is:" + error);
    }
}

//creating a middleware
employeschema.pre("save", async function(next) {
    if(this.isModified("password"))
    {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);;
    }
    next();
})

//create a collection

const Register = new mongoose.model("register", employeschema);
module.exports = Register;