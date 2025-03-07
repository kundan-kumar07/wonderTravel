if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}

 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

const session = require("express-session");
const MongoStore=require('connect-mongo')

const flash = require("connect-flash");

const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

const { error } = require('console');

// Set up Express engine and middleware
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON parsing
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB Connection
// const mongo_url = "mongodb://127.0.0.1:27017/wondertravel";
const dbUrl=process.env.ATLASDBURL;
async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}
main();
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
     secret:process.env.SECRET
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("error in mongo store",error);
})
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


// Home Route
app.get("/", (req, res) => {
  res.redirect('/listings');
});

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  next();
});

// app.get('/demouser',async (req,res)=>{
//   let fakeUser=new User({
//     email:"student@7068.com",
//     username:"delta-batch555"
//   }) 
//   const registeredUser=await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// })

// Modular Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use('/',userRoutes);

// 404 Error Handler
app.use((req, res, next) => {
  res
    .status(404)
    .render("error", { errorMessage: "Page not found!", errorCode: 404 });
});

// Global Error Handler
// Global Error Handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
    statusCode = 500;
  }
  res.status(statusCode).render("error", { errorMessage: message, errorCode: statusCode });
});


// Start Server
app.listen(5000, () => {
  console.log("Server is listening on port 5000...");
});
