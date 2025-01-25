const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");

const validateReview =(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");

        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};
 //review route//post rout

 router.post("/",validateReview,
    wrapAsync(async(req,res)=>{
  let Listing = await listing.findById(req.params.id);
   let newReview = new review(req.body.review);

   Listing.reviews.push(newReview);
   await newReview.save();
   await Listing.save();
   req.flash("success", "New review created");
  res.redirect(`/listings/${Listing._id}`);
 })
);

//delete review  route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;

   await listing.findByIdAndUpdate(id,{$pull: { review :reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
})
);

module.exports = router;
