import Notification from "../models/NotificationModel.js";
import services_ from "../models/Services_model.js";

// ✅ FETCH REQUESTS FOR MECHANIC
export const mechanic_requests = async (req, res) => {
  try {
    console.log("Received mechanic request:", req.body);

    const mechanic_mobile =
      req.mobile?.mechanic_mobile || req.body.mechanic_mobile;

    if (!mechanic_mobile) {
      return res.status(400).json({ message: "mechanic_mobile is required" });
    }

    const notifications = await Notification.find({ mechanic_mobile });

    if (!notifications.length) {
      return res
        .status(404)
        .json({ message: "No requests found", requests: [] });
    }

    // ✅ Clean response format
    const requested_service = notifications.map((n) => ({
      customer_mobile: n.customer_mobile,
      latitude: n.latitude,
      longitude: n.longitude,
      issue_description: n.message,
      notification_id: n._id,
      service_id: n.service_id,
      isAccept: n.isAccept,
    }));

    return res.status(200).json({ requested_service });
  } catch (error) {
    console.error("Error handling mechanic request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ ACCEPT REQUEST
export const acceptRequest = async (req, res) => {
  try {
    const { notification_id } = req.body;
    console.log("Accepting notification ID:", notification_id);
    const notification = await Notification.findById(notification_id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // ✅ Update notification as accepted
    notification.isAccept = true;
    await notification.save();

    // ✅ Update service details
    console.log("Finding service ID:", notification.service_id);
    const service = await services_.findById(notification.service_id);
    console.log("Associated service:", service);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.status = "accepted";
    service.mechanic_id = notification.mechanic_id; // ✅ Assign mechanic
    await service.save();

    return res.status(200).json({
      message: "Service accepted successfully",
      notification,
      updated_service: service,
    });
  } catch (error) {
    console.error("Error accepting service:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ REJECT REQUEST
export const rejectRequest = async (req, res) => {
  try {
    const { notification_id } = req.body;

    const notification = await Notification.findById(notification_id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // ✅ Mark as rejected
    notification.isAccept = false;
    await notification.save();

    // ✅ Reset service status (you can change if needed)
    const service = await services_.findById(notification.service_id);
    if (service) {
      service.status = "pending";
      await service.save();
    }

    return res.status(200).json({
      message: "Service rejected successfully",
      notification,
    });
  } catch (error) {
    console.error("Error rejecting service:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ EXPORT
export default {
  mechanic_requests,
  acceptRequest,
  rejectRequest,
};
