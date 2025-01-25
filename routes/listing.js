const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing =(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");

        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};


//index route

router.get("/",wrapAsync(async (req,res)=>{
    let alllisting = await listing.find({});
    // console.log(alllisting);
    res.render("listings/index.ejs", { alllisting });
     res.send("hello");

   }),
   );
   
   
   
   //new route
   
   router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
       });
       
       
   //show route
   
   router.get("/:id",
     wrapAsync(async(req,res)=>{
       let {id} = req.params;
       const listings= await listing.findById(id).populate("reviews").populate("owner");
       if(!listing){
        req.flash("error", "Listing you requested for does not exit!");
        res.redirect("/listings");
       }
       console.log(listings);
       res.render("listings/show.ejs", { listings});
   })
   );
   
   //create route 
  router.post
   ("/",
    isLoggedIn,
    validateListing,
       wrapAsync(async(req,res,next)=>{
          
           const newlisting = new listing(req.body.listing);
           newlisting.owner = req.user._id;
             await newlisting.save();
             req.flash("success", "New listing created");
       res.redirect("/listings");
       })
   );
   
   //edit route
   router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(async(req,res)=>{
       let {id} = req.params;
       const listings= await listing.findById(id);
       if(!listing){
        req.flash("error", "Listing you requested for does not exit!");
        res.redirect("/listings");
       }
       req.flash("success", "listing edited");
       res.render("listings/edit.ejs",{listings});
   
   })
   );
   
   //update route 
   
   router.put("/:id",
    isLoggedIn,
     validateListing,
       wrapAsync(async(req,res)=>{
       let {id}=req.params;
       await listing.findByIdAndUpdate(id,{...req.body.listing});
       req.flash("success", "listing updated");
   res.redirect(`/listings/${id}`);
   })
   );
   
   //delete route
   router.delete("/:id",
    isLoggedIn,
    wrapAsync(async(req,res)=>{
       let {id} = req.params;
       let deletelisting = await listing.findByIdAndDelete(id);
      console.log(deletelisting);
      req.flash("success", "Listing deleted");
       res.redirect("/listings");
   })
   );
   
   module.exports = router;