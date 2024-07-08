const mongoose = require("mongoose")

async function connectTODb(){
   await mongoose.connect("mongodb+srv://078bct049:Mdastafar@cluster0.0w3zzxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
   console.log("Database connected")
}

module.exports = connectTODb