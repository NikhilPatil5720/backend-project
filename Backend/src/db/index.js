import mongoose from "mongoose" 
import {DB_Name} from "../constants.js"



const Connectdb= async()=>{
    try{
       const  connectioninstance= await mongoose.connect(`${process.env.DB_Url}/${DB_Name}`)
  console.log(`✅ MongoDB connected! DB host: ${connectioninstance.connection.host}`);  
console.log("App is running on port", process.env.PORT);    }
    catch(err){
        console.log('Error',err);
        process.exit(1);
    }
}

export default Connectdb;