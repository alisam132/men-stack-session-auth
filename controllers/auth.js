const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
    res.render("auth/sign-up.ejs");
  });
  
  router.post("/signup", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
        return res.send("Username already taken.");     
}
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
    }

    //create a user

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body)

    res.send(newUser.username)
  });


  router.get("/signin", (req, res) => {
    res.render("auth/sign-in.ejs");
  });

  router.post("/signin", async (req, res) => {

    const userInDatabase = await User.findOne({ username: req.body.username });
    
    if (!userInDatabase) {
        return res.send("Login failed. Please try again.");
    }

    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );

    if (!validPassword) {
        return res.send("Login failed. Please try again.");
    }      

    req.session.user = {
     username: userInDatabase.username,
    _id: userInDatabase._id
    };
      
    res.redirect("/");

  });
  

  router.get("/signout", (req, res) => {
    res.send("The user wants out!");
  });
  
  
  
  module.exports = router;