import Notification from "../models/NotificationModel.js";
import services_ from "../models/Services_model.js";
export const showAcceptRequest=async (req,res)=>
{
    try {
        const {mobile}=req.body.req;
        
        console.log("mobiel data in backend logic",mobile);
        const acceptedNotification=await Notification.findOne({customer_mobile :mobile,isAccept:true});
        console.log(acceptedNotification);
        if(!acceptedNotification)
        {
            return res.status(404).json({message:"No accepted service found"});
        }
        const mechanic_name=acceptedNotification.mechanic_name;
        const mechanic_mobile=acceptedNotification.mechanic_mobile;
        //const message=`Service completed by ${mechanic_name}. Contact: ${mechanic_mobile}`;
        const mechanic_latitude=acceptedNotification.latitude;
        const mechanic_longitude=acceptedNotification.longitude;
        const service_id=acceptedNotification.service_id;
        return res.status(200).json({message:"Service completed successfully",mechanic_latitude,mechanic_longitude,mechanic_mobile,mechanic_name,service_id});
    } catch (error) {
        console.error("Error completing service:", error);
        return res.status(500).json({message:"Internal server error"});
    }       
}

export const completeRequest= async(req,res)=>
{
    try {
        const {service_id}=req.body;
        //console.log("service id is ",service_id)
        //const notification=await Notification.findOneAndDelete({service_id:service_id,isAccept:true});
        const service=await services_.findById(service_id);
        if(!service)
        {
            return res.status(404).json({message:"Service not found"});
        }
        service.status="completed";
        await service.save();
        return res.status(200).json({message:"Service marked as completed",service});
    } catch (error) {
        console.error("Error completing service:", error);
        return res.status(500).json({message:"Internal server error"});
    }       
}