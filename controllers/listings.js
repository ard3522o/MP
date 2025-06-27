const Listing = require("../models/listing");

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
const newListing = new Listing(req.body.listing);
newListing.owner = req.user._id;

await newListing.save();
req.flash("success", "new listing created");
res.redirect("/listings");

}