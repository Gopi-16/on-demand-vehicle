import Mechanic from "../models/Mechanic_model.js";
import User from "../models/usermodel.js";
import Vehicle from "../models/Vehicle_model.js";
import jwt from "jsonwebtoken";
import { signAccessToken,signRefreshToken,verifyAccesToken,verifyRefreshToken } from "../utils/Jwt.js";

const register = async (req, res) => {
    //console.log(req.body);
    const {username, email, password,mobile,vehicle_number,address,latitude,longitude,type} = req.body;
    console.log(req.body)
    if (type!="mechanic"){
        const vehicle_=await Vehicle.findOne({vehicle_number:vehicle_number})
        //console.log(await Vehicle.find())
        if(!vehicle_){
            return res.json({message:"Vehicle not found"});
        }
        if (vehicle_.vehicle_number==vehicle_number){
            const newUser = new User({ username, email, password,mobile ,vehicle_number});
            await newUser.save()
            .then(user => res.status(201).json({ message: 'User registered successfully', user }))
            .catch(err => res.status(500).json({ error: 'Error registering user', details: err }));}
        else{
            return res.status(400).json({error:"Invalid Vehicle Number"})
        }

    }
    else{
        const newMechanic=new Mechanic ({username,email,password,mobile,address,latitude,longitude} );
        newMechanic.save().then(mechanic=> res.status(201).json({message:"Mechanic registered Succesfully",mechanic}))
    .catch(err=>res.status(500).json({error:"Error registering mechanic",details:err}));
    }

    
}
function isEmail(input)
{
    return /\S+@\S.\S+/.test(input);
}
function isPhone(input)
{
    return /^\d{10}$/.test(input);
}
const login=  async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    //console.log(req.body)
    let user;
    //console.log(isEmail("Ru@gmail.com"));
    if(isEmail(username))
    {
        user=await User.findOne({email:username})
        if (!user)
        {  
            user=await Mechanic.findOne({email:username})
        }
    }
    else if (isPhone(username))
    {
        user=await User.findOne({mobile:username})
        if (!user)
        {
            
            user=await Mechanic.findOne({mobile:username})
        }
    }
    else {
        return res.status(400).json({error:"Invalid user"})
    }
    if(!user){
        return res.status(404).json({error:"User not found"})
    }
    if(user.password!==password){
        //console.log(user.password)
        //console.log(password)
        return res.status(401).json({error:"Invalid password"})
    }
    const token=await jwt.sign({type:"user",email:user.email},process.env.ACCESS_TOKEN_SECRET)
    return res.status(200).json({message:"Login successful",user,token})
}   

const getUser = async(req,res)=>{
    const userDetails = req.user;
    const user = await User.findOne({email:userDetails.email});
    if(!user) return res.status(404).json({message:"User not found"});
    else{
        console.log(user)
        return res.json(user);
    }
}
export default { register,login,getUser };