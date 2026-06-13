const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn , isowner , validateListing} = require("../middleware.js");

//phase three
const listingController = require("../controllers/listing.js");

//it's accept the file in backend
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router
.route("/")
//index
.get(wrapAsync(listingController.index))
//create listing
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);

//new Route
router.get("/new",isLoggedIn, wrapAsync(listingController.renderNewForm));


router
.route("/:id")
//show listing
.get(wrapAsync(listingController.showListing))

//update route
.put(
  isLoggedIn,
  isowner,
  upload.single('listing[image]'), // ✅ ADD THIS
  validateListing,
  wrapAsync(listingController.updateListing)
)

//delete route
.delete( isLoggedIn ,isowner,wrapAsync(listingController.deleteListing))



//Edit route
router.get("/:id/edit", isLoggedIn,isowner,wrapAsync(listingController.editListing));


module.exports = router;