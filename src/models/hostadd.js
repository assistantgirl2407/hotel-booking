// ========================================REQUIRE MONGOOSE=====================================
const mongoose = require('mongoose')

//======================================CREATING HOST DATA TO CREATE  A SCHEMA AND DEFINING TEMPLATE AND STRUCTURE========================================

const HostSchema = new mongoose.Schema({
    HomeName:{
        type: String,
        required: true,
        unique: true,
    },
   Location:{
    type:String,
    required:true,
   },
    PropertyType:{
        type:String,
        required:true,
    },
    minimum_nights:{
        type:String,
        
    },
    neighbourhood_overview:{
        type:String,
         
    },
    cancellation_policy:{
        type:String,
         },
    Price:{
        type: Number,
        required: true,
    },
     
  

});


// ===============================================CREATING COLLECTION==========================================================
const hostdata = new mongoose.model("host_data",HostSchema)
module.exports = hostdata;
 
