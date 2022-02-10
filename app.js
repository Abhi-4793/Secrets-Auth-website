//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();


app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String ,
    password:String
});





const User = new mongoose.model("User",userSchema);

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.post("/register",(req,res) =>{
    bcrypt.hash(req.body.password,saltRounds,function (err,hash) { 
        const newUser = new User({
            email:req.body.username,
            password:hash
        });
        
        newUser.save((err)=>{
            if(err)
            {
                console.log(err);
            }
            else{
                res.render("secrets");
            }
        });
     });

});

app.post("/login",(req,res)=>{
const username = req.body.username;
const password = req.body.password;
User.findOne({email:username},(err,foundUser)=>{
    if(err){
        console.log(err);
     }
    else{
      if(foundUser){
        bcrypt.compare(password,foundUser.password,function (err,results) {
            
            if(results==true)
            {
                res.render("secrets");
            }
          });
              
          
      }
    }
});
});

app.listen(3000, () => {
    console.log('app listening on port 3000!');
});

//Run app, then load http://localhost:3000 in a browser to see the output.