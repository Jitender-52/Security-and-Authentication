//jshint esversion:6

require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
// const { application } = require("express");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

// const userSchema = {
//   email: String,
//   password: String,
// };

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

// app.post("/register", function (req, res) {
//   const newUser = new User({
//     email: req.body.username,
//     password: md5(req.body.password)
//   });
//   // console.log(md5(req.body.password));

//   newUser.save(function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("secrets");
//     }
//   });
// });

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });

    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

// app.post("/login", function (req, res) {
//   const username = req.body.username;
//   const password = md5(req.body.password);

//   //   console.log(username);
//   //   console.log(password);

//   User.findOne({ email: username }, function (err, foundUser) {
//     if (foundUser) {
//       if (foundUser.password === password) {
//         res.render("secrets");
//       } else {
//         res.send(err);
//       }
//     }
//   });

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if(err)
    {
      console.log(err);
    }
    else
    {
      if (foundUser) 
      {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            res.render("secrets");
          }
        });
      }
  }
  });
});

//   User.findOne(function(err, foundUser){
//     if(err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         if(foundUser)
//         {
//             if(foundUser.password === password)
//             {
//                 res.render("secrets");
//             }
//         }
//     }
//   });
// });

// app.listen(process.env.PORT || 3000, function () {
//   console.log("Server has started on port 3000");
// });

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server started succesfully");
});
