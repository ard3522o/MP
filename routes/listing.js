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
router.get("/:id/edit", wrapAsync(listingController.renderEditForm));
//update route
router.put("/:id", wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id", wrapAsync(listingController.destroyListing));

module.exports = router;