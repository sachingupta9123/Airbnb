const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review.js"); 
const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
        },
   description: {
    type : String,
    required : true,
   },

   image: {
    url : String,
    filename : String
},
    price : Number,
    location: String,
    country : String,

    //map field
    latitude: Number,
    longitude: Number,
    

    //this is for review add last time
    reviews:[
      {type : Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
});

//mongoose middleware  // if i delete listing then also delete review
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }
});


//model creating
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;