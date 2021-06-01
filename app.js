//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true, useUnifiedTopology: true});
////////////////////////// Code start ////////////////////////////////////////
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
console.log(process.env.API_KEY);

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);


app.get("/", function(req,res){
  res.render("home");
});

app.route("/login")
.get( function(req,res){
  res.render("login");
})
.post(function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function(err, foundUser){
    if (err){
      console.log(err);
    }else {
      if (foundUser.password === password){
        res.render("secrets");
      }else{
        res.send("Wrong Password")
      }
    }
  });
});


app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});



app.listen(3000, function(req,res){
  console.log("Server running on port 3000.");
});
