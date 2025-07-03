const Listing = require("../models/listing");
const { listingSchema } = require('../models/validateListing');


module.exports.index = async (req, res)=>{
  const allListings =  await Listing.find({});
  
 // console.log(allListings.map(l => l.image)); 
  res.render("listings/index.ejs", {allListings});
    }

    module.exports.renderNewForm = (req, res) => {
  if(!req.isAuthenticated()){
    req.flash("error", "You must be logged in");
   return res.redirect("/login");
  }
res.render("listings/new.ejs");
}

module.exports.showListing = async(req, res)=>{
let {id} = req.params;
 const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
// console.log(listing);

 res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res, next) => {
 

  if(!req.isAuthenticated()){
   
    req.flash("error", "You must be logged in");
   return res.redirect("/login");
  }
let result = listingSchema.validate(req.body);
// console.log(result);
 let url = req.file.path;
    let filename = req.file.filename;
    
const newListing = new Listing(req.body.listing);
newListing.owner = req.user._id;
newListing.image = {url, filename};
await newListing.save();
req.flash("success", "new listing created");
res.redirect("/listings");

}

module.exports.renderEditForm = async (req, res) =>{
  if(!req.isAuthenticated()){
    req.flash("error", "You must be logged in");
   return res.redirect("/login");
  }

let {id} = req.params;
 const listing = await Listing.findById(id);
 let originalImageUrl = listing.image.url;
 originalImageUrl.replace("/upload", "/upload/h_300,w_350");
 res.render("listings/edit.ejs", { listing, originalImageUrl });

}

module.exports.updateListing = async (req, res)=>{
  if(!req.isAuthenticated()){
    req.flash("error", "You must be logged in");
   return res.redirect("/login");
  }
let {id} = req.params;
let listing =  await Listing.findByIdAndUpdate(id, {...req.body.listing});
if(typeof req.file !== "undefined"){
let url = req.file.path;
    let filename = req.file.filename;
listing.image = {url, filename};
await listing.save();
}
res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);  
  console.log(deletedListing);
  res.redirect("/listings");
}