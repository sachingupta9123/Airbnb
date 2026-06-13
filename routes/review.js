const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");




//Reviews
//post Route

router.post(
  "/", 
  isLoggedIn ,
  validateReview,
  wrapAsync( async(req,res)=>{ 
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("new review saved");
  req.flash("success", "Successfully new review created!");
  res.redirect(`/listings/${listing._id}`);
}));


//Delete Reviews route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // ✅ remove review from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    // ✅ delete review
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;