const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");

const listingController = require("../controllers/listings.js"); 




router.get("/", wrapAsync(listingController.index));
    //new route
router.get("/new", listingController.renderNewForm);
//show route
router.get("/:id", listingController.showListing);
//create route
router.post("/", wrapAsync(listingController.createListing));
//edit route
router.get("/:id/edit", wrapAsync(async (req, res) =>{
  if(!req.isAuthenticated()){
    req.flash("error", "You must be logged in");
   return res.redirect("/login");
  }
let {id} = req.params;
 const listing = await Listing.findById(id);
 res.render("listings/edit.ejs", { listing });
}));
//update route
router.put("/:id", wrapAsync(async (req, res)=>{
  if(!req.isAuthenticated()){
    req.flash("error", "You must be logged in");
   return res.redirect("/login");
  }
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