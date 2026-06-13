//we can't access env variable directly so i am using dotenv to access
if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
//we use ejs-mate for styling
const ejsMate = require("ejs-mate")
const methodoverride = require("method-override");
const MONGO_URL = "mongodb+srv://sachin912325_db_user:kVyv5uaWKD8staLA@airbnb.2a9qthb.mongodb.net/";
const ExpressError = require("./utils/ExpressError.js");

//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//session require
const session = require("express-session");
const { Http2ServerRequest } = require("http2");

//flash require
const flash = require("connect-flash");


//routes import
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

// MongoDB connection
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Server
const port = 8080;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

//view engine
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true }));

//put method ke
app.use(methodoverride("_method"));
//boilerplate
app.engine('ejs',ejsMate);
//public file ke
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.redirect("/listings");
});
 
// Root route
// app.get("/", (req, res) => {
//   res.send("Hi, I am root!");
// });




//session ke

const sessionOptions = {
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized :true,

  cookie: {
      //we are set expiration time of cookie
    //curr date + 7 days + 24 hours + 60 minutes + 60 seconds
  expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  maxAge: 7 * 24 * 60 * 60 * 1000
}
}


app.use(session(sessionOptions));
//use flash
app.use(flash());

//passport library
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

   //we use req . user to check if user is logged in 

  res.locals.currentUser = req.user;
  next();
});

//demo route
//here use pbkdf2 for password encryption (hashing)
// app.get("/demo", async(req, res) => {
//   let fakeUser = new User({
//     email : "sachin@me.com",
//     username : "sachin",
//   });

//   let registeredUser = await User.register(fakeUser, "sachin");
//   res.send(registeredUser);
// });


//it's for route
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


//to handle error

app.use((err, req, res, next) => {
  console.error("ERROR OCCURRED:");
  console.error(err);

  const { statusCode = 500, message = "Something went wrong" } = err;

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).send(message);
});