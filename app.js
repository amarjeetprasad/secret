require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect('mongodb://127.0.0.1/UserDB',{useNewUrlParser: true,useUnifiedTopology: true });
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));


/////////////////////////Database////////////////////////
const userSchema=new mongoose.Schema({
    username:String,
    password:String
})

/////////////////enccripting our password //////////////////
userSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields: ['password'] });
const User = mongoose.model("User",userSchema);

/////////////////HOME route /////////////////////////////
app.get("/",(req,res)=>{
    res.render("home.ejs");
});

///////////////////register route /////////////////////////
app.route("/register")
.get((req,res)=>{
    res.render("register.ejs");
})
.post((req,res)=>{
    const username=req.body.username;
    const  password=req.body.password;
     const user=new User({
         username:username,
         password:password
     })
     user.save((err)=>{
         if(err)
         console.log(err);
         else
         res.render("secrets.ejs")
     });
     
})

/////////////////login route////////////////////
app.route("/login")
.get((req,res)=>{
    res.render("login.ejs");
})
.post((req,res)=>{
    User.findOne({username:req.body.username},(err,foundUser)=>{
        if(err)
        console.log(err);
        else
        if(foundUser)
        {
            if(foundUser.password===req.body.password)
            {
                res.render("secrets");
            }
            else
            {
                res.redirect('/login');
            }
        }
        else
        {
            res.send("something is wrong!");
        }
    })
})




app.listen("3000",()=>{
    console.log("server is running at port 3000");
})