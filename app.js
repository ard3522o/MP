
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate'); 
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000, 
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};
app.get("/", (req, res)=> {
    res.send("Hi I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next)=> {
    res.locals.success = req.flash("success");
    next();
});

app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);

// app.get("/testListing", async (req, res) =>{
// let sampleListing = new Listing({
//     title: "My Home",
//     description: "By the beach",
//     price: 100,
//     location: "Azamgarh",
//     country: "India",

// });
// await sampleListing.save();
// console.log("sample was saved");
// res.send("successfull testing");
// });

//  app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
//  });
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
});
app.use((err, req, res, next)=> {
   let {statusCode, message} = err;
   res.render("error.ejs");
   //res.status(statusCode).send(message);
});

app.listen(8080, () => {
console.log("App is listening to port 8080");
});