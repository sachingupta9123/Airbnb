const Review = require("./models/review");
const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema ,  reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
      //rediredirect save
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You must be logged in to create listings!");
      return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
 if(req.session.redirectUrl){
   res.locals.redirectUrl = req.session.redirectUrl;
 }
 next();
};


module.exports.isowner = async(req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){
  req.flash("error", "You don't have permission to do that!");
  return res.redirect(`/listings/${id}`);
}
next();
};


module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    req.flash("error", errMsg);
    return res.redirect("/listings/new");  // stop execution
  }

  next();
};


//reviews
module.exports.validateReview = (req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).render("listings/new.ejs", {
        error: error.details[0].message
      });
    }else{
      next();
    }
}



module.exports.isReviewAuthor = async(req, res, next) => {
  let { id , reviewId } = req.params;

  let review = await Review.findById(reviewId);   // ✅ correct model

  if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};