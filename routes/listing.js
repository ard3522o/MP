const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");





router.get("/", async (req, res)=>{
  const allListings =  await Listing.find({});
  
 // console.log(allListings.map(l => l.image)); 
  res.render("listings/index.ejs", {allListings});
    });
    //new route
router.get("/new", (req, res) => {
res.render("listings/new.ejs");
});
//show route
router.get("/:id", async(req, res)=>{
let {id} = req.params;
 const listing = await Listing.findById(id).populate("reviews");
 res.render("listings/show.ejs", {listing});
});
//create route
router.post("/", wrapAsync( async (req, res, next) => {
let result = listingSchema.validate(req.body);
console.log(result);
const newListing = new Listing(req.body.listing);
await newListing.save();
req.flash("success", "new listing created");
res.redirect("/listings");

}));
//edit route
router.get("/:id/edit", wrapAsync(async (req, res) =>{
let {id} = req.params;
 const listing = await Listing.findById(id);
 res.render("listings/edit.ejs", { listing });
}));
//update route
router.put("/:id", wrapAsync(async (req, res)=>{
let {id} = req.params;
await Listing.findByIdAndUpdate(id, {...req.body.listing});
res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", wrapAsync(async (req, res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);  
  console.log(deletedListing);
  res.redirect("/listings");
}));

module.exports = router;