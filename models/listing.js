const mongoose = require("mongoose");

const schema = mongoose.Schema;
const listingSchema = new schema({
    title:{
       type: String,
    required: true,
    },

    description: String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1731347910715-f8ccc7c2d104?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    
        set:(v)=>v=== ""?"https://images.unsplash.com/photo-1731347910715-f8ccc7c2d104?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    },
    price:Number,
    location:String,
    country:String,
});

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;