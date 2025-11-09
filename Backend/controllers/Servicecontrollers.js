import services_ from "../models/Services_model.js";
import Mechanic from "../models/Mechanic_model.js";
import { getDistance } from "geolib";
import User from "../models/usermodel.js";
import  Notification  from "../models/NotificationModel.js";

const service_matching = async (req, res) => {
  try {
    const {
      username,
      latitude,
      longitude,
      mobile,
      vehicle_number,
      repair_msg,
      createdAt
    } = req.body;

    // ✅ Use email from user
    const user = await User.findOne({ mobile });
    const email = user ? user.email : "";

    // ✅ Create service object
    const newService = new services_({
      username,
      mobile,
      email,
      service: repair_msg,
      status: "pending",
      mechanic_id: "",
      price: "",
      latitude,
      longitude,
      createdAt,
      vehicle_number
    });

    const mechanics = await Mechanic.find();
    if (!mechanics.length) {
      const saved = await newService.save();
      return res.status(201).json({
        message: "No mechanics found",
        service: saved,
        mechanics: []
      });
    }

    // ✅ Calculate distance
    const mechanicDistances = mechanics.map((mechanic) => ({
      mechanic,
      distance: getDistance(
        { latitude, longitude },
        { latitude: mechanic.latitude, longitude: mechanic.longitude }
      )
    }));

    mechanicDistances.sort((a, b) => a.distance - b.distance);

    const top5Mechanics = mechanicDistances.slice(0, 5);

    const closestMechanic = top5Mechanics[0]?.mechanic || null;

    if (closestMechanic) {
      newService.mechanic_id = closestMechanic._id;
      newService.price = "100";
      newService.status = "assigned";
    }

    // ✅ Save top 5 mechanic IDs
    newService.top5_mechanics = top5Mechanics.map(
      (item) => item.mechanic._id
    );

    const savedService = await newService.save();

    // ✅ Create notifications
    await Promise.all(
      top5Mechanics.map(({ mechanic }) =>
        Notification.create({
          mechanic_id: mechanic._id,
          mechanic_mobile: mechanic.mobile,
          customer_mobile: mobile,
          message: `New service request: ${repair_msg}`,
          latitude:latitude,
          longitude:longitude,
          isAccept: false,
          mechanic_name:mechanic.username,
          service_id: savedService._id ,
        })
      )
    );

    res.status(201).json({
      message: "Service request processed. Top 5 mechanics notified.",
      service: savedService,
      top5Mechanics
    });

  } catch (err) {
    console.error("service_matching error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message
    });
  }
};

export default service_matching;
