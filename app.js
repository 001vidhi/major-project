const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');

MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'
 main().then(()=>{
    console.log("connection to DB");
})
.catch((err)=>{
    console.log(err);

});
async function main(){
    await mongoose.connect(MONGO_URL);
} 

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
 app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



//index route

app.get("/listings",async (req,res)=>{
 let alllisting = await listing.find({});
 res.render("listings/index.ejs", { alllisting });
});



//new route

app.get("/listings/new",(req,res)=>{
res.render("listings/new.ejs",);
    });
    
    
//show route

app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const listings= await listing.findById(id);
    res.render("listings/show.ejs", { listings});
});

//create route 
app.post("/listings",async(req,res)=>{
    const newlisting = new listing(req.body.listing);
    await newlisting.save();
res.redirect("/listings");

});

//edit route
app.get("/listings/:id/edit", async(req,res)=>{
    let {id} = req.params;
    const listings= await listing.findById(id);
    res.render("listings/edit.ejs",{listings});

});

//update route 

app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deletelisting = await listing.findByIdAndDelete(id);
   console.log(deletelisting);
    res.redirect("/listings");
});


// app.get("/listing", async(req,res)=>{
//     let samplelisting = new listing ({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location :"calagute goa",
//         country:"india",

//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// });

app.get("/",(req,res)=>{
    res.send("hii i am root");
});

app.listen(8080,()=>{
    console.log("server is listening port 8080");
});