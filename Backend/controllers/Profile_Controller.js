import Mechanic from "../models/Mechanic_model.js";
import User from "../models/usermodel.js";
import services_ from "../models/Services_model.js";

const Profile = async (req, res) => {
    try {
        const user_details = req.user;

        // Find user
        let user = await User.findOne({ email: user_details.email });
        let is_mechanic = false;

        // If not found in User collection, check mechanic collection
        if (!user) {
            user = await Mechanic.findOne({ email: user_details.email });
            is_mechanic = true;
        }

        if (!user) {
            return res.status(404).json({ message: "User Not found" });
        }

        // Fetch services
        let user_services = [];
        if (!is_mechanic) {
            // User
            user_services = await services_.find({ email: user.email });
        } else {
            // Mechanic
            user_services = await services_.find({ mechanic_id: user._id });
        }

        // ✅ FIX: initialize stats
        let stats = {
            completed: 0,
            rejected: 0,
            pending: 0,
            total: user_services.length
        };

        stats.completed = user_services.filter(s => s.status === "completed").length;
        stats.rejected = user_services.filter(s => s.status === "rejected").length;
        stats.pending = user_services.filter(s => s.status === "pending").length;

        const pending_requests = user_services.filter(s => s.status === "pending");
        console.log("Pending Requests:", pending_requests);
        return res.json({
            user_details: user,
            user_services,
            stats,
            pending_requests,
            is_mechanic
        });

    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default { Profile };
