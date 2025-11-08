import mongoose from "mongoose";    

const mechanicSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },  
  mobile:{
    type:String,
    required:true,
    unique:true
  } ,
  address:{
    type:String,
    required:true,
  }  ,
  latitude:
  {
    type:Number,
  },
  longitude:{type:Number}
                       
}, { timestamps: true });

const Mechanic = mongoose.model("Mechanic_data", mechanicSchema);

export default Mechanic;
