import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicle_number: {
        type: String,
        required:true},
    owner_name: {
        type: String,
        required: true},
    mobile_number: {
        type: String,
        required: true},
    state: {
        type: String,
        required: true}
});

const Vehicle = mongoose.model("Vehicle_Data", vehicleSchema);

export default Vehicle;