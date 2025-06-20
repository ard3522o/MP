const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
//Reviews
//Post Route
router.post("/", async (req, res) => {
    
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
   res.redirect(`/listings/${listing._id}`);
});

//Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) =>{
    let {id, reviewId} = req.params;
 await   Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
await Review.findByIdAndDelete(reviewId);

res.redirect(`/listings/${id}`);
}));

module.exports = router;
