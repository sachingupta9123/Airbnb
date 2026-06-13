const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

// SIGNUP PAGE
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// SIGNUP LOGIC
// passport-local-mongoose uses pbkdf2 to hash the password
router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({
            username: username,
            email: email
        });

        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
             req.flash("success", "Welcome to Wonderlust!");
             res.redirect("/listings");
        });
       

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));


// LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// LOGIN LOGIC
router.post("/login",
    saveRedirectUrl,
passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),
async(req,res)=>{
    req.flash("success","Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
});

// LOGOUT LOGIC
router.get("/logout", (req, res,next) => {
    req.logout((err)=>{
        if(err){
           return next(err);
        }
    });
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
});

module.exports = router;