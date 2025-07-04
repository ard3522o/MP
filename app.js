if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Models & Routes
const Listing = require("./models/listing");
const Review = require("./models/review");
const User = require("./models/user");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

// Utils
const ExpressError = require("./utils/ExpressError");

// MongoDB Atlas URL
const dbUrl = process.env.ATLASDB_URL || "mongodb://localhost:27017/yourdb";

// Database Connection
async function main() {
  console.log("Connecting to:", dbUrl);
  await mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 20000,
  });
}

main()
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Mongoose connection events
mongoose.connection.on("error", (err) => {
  console.error("🚨 Mongoose connection error:", err);
});
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connected to database");
});

// App Config
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET || "tempsecret",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN SESSION MONGO STORE", err);
});

// Session Config
const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET || "tempsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & Current User Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Root Route - ADDED THIS FIX
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Error Handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

// Server Start
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});