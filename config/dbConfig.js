const mongoose = require('mongoose')
require("dotenv").config()
module.exports.dbConfig =async ()=>{
   try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('database connected successfully...')
   }
   catch(error)
   {
      console.log('An error occurred ',error)
   }
   
}