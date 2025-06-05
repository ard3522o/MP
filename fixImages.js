const mongoose = require("mongoose");
const Listing = require("./models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60";

async function fixListings() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to DB");

  const listings = await Listing.find({});
  let updatedCount = 0;

  for (let listing of listings) {
    const img = listing.image;

    if (!img || typeof img !== "string" || img.trim() === "") {
      listing.image = DEFAULT_IMAGE;
      await listing.save();
      console.log(`✅ Fixed listing: ${listing.title}`);
      updatedCount++;
    }
  }

  console.log(`🔧 Total fixed: ${updatedCount}`);
  mongoose.connection.close();
}

fixListings().catch(console.error);
