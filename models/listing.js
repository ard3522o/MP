const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{ 
        type: String,
        required: true,

    },
    description: String,
    image:{ 
        type: String,
    set: (v)=> v===""?"default link":"https://unsplash.com/photos/night-scene-of-a-busy-street-with-lights-u83VIV39t44",
    }, 
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;