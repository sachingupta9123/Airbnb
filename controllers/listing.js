//phase three

const Listing = require("../models/listing");

//listings
module.exports.index  = async (req, res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
}

//new listing
module.exports.renderNewForm = (req,res)=>{
  res.render("listings/new.ejs",{error:null});
  }

  //show route

  module.exports.showListing = async (req , res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({path : "reviews",
  populate : {path : "author"}})
  .populate("owner");
  if(!listing){
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");

  }
  console.log(listing);

  res.render("listings/show.ejs", {listing});
};

//create route

module.exports.createListing = async (req, res) => {
  try {
    // image handling
    let filename = req.file.filename;
    let url = `/uploads/${filename}`;

    // create listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // store image
    newListing.image = { url, filename };

    // save to DB
    await newListing.save();

    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");

  } catch (err) {
    console.log(err);
    res.redirect("/listings");
  }
};


  //edit route
 
  module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    if(!listing){
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
  
    }

    let originalImageUrl = listing.image.url;
    originalImageurl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing , originalImageUrl});
  };


  //update route

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if(typeof req.file !== "undefined"){
       //L wala listing hona chahiye nahi to object maan leta
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

     let filename = req.file.filename;

  // ✅ FIXED URL
      let url = `/uploads/${filename}`;
      listing.image ={url , filename};
      await listing.save();
    }

      req.flash("success", "Successfully made a new listing!");
      return res.redirect("/listings"); // ✅ CHANGED HERE
  };


  //delete route

  module.exports.deleteListing = async(req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
      