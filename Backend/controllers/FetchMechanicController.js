import Notification from "../models/NotificationModel.js";
import Mechanic from "../models/Mechanic_model.js";

export const fetch_mechanic = async (req, res) => {
  try {
    console.log("Got request ->", req.body);

    const { customer_mobile } = req.body;

    if (!customer_mobile) {
      return res.status(400).json({ message: "customer_mobile is required" });
    }

    // ✅ Fetch all notifications for this customer
    const notifications = await Notification.find({
      customer_mobile: customer_mobile,
    });

    if (!notifications.length) {
      return res
        .status(404)
        .json({ message: "No mechanics found", mechanics: [] });
    }

    // ✅ Fetch mechanic details for each notification
    const mechanics = await Promise.all(
      notifications.map(async (n) => {
        const mechanic = await Mechanic.findById(n.mechanic_id);
        if (!mechanic) return null;

        return {
          mechanic_id: mechanic._id.toString(),
          name: mechanic.username || "Unknown",
          mobile: mechanic.mobile,
          location: mechanic.address || "Unknown",
          specialist: mechanic.specialist || "General Mechanic",
          isAccept: n.isAccept,
          notification_id: n._id,
        };
      })
    );

    // ✅ Remove null entries
    const filtered = mechanics.filter((m) => m !== null);

    // ✅ Remove duplicate mechanics by mechanic_id
    const uniqueMap = new Map();
    filtered.forEach((m) => {
      if (!uniqueMap.has(m.mechanic_id)) {
        uniqueMap.set(m.mechanic_id, m);
      }
    });

    const uniqueMechanics = Array.from(uniqueMap.values());

    return res.status(200).json({
      message: uniqueMechanics.length + " unique mechanics found",
      mechanics: uniqueMechanics,
    });

  } catch (e) {
    console.error("Fetch mechanic error:", e);
    return res.status(500).json({ message: "Internal server error", error: e.message });
  }
};

export default fetch_mechanic;
