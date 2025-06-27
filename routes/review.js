const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");

//Reviews
//Post Route
router.post("/", wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", wrapAsync(reviewController.destroyReview));

module.exports = router;
