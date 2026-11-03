const Registration = require("../models/Registration");
const Event = require("../models/Event");

// Register for an event

const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const existing = await Registration.findOne({
            student: req.user.id,
            event: eventId,
            status: "registered"
        });

        if (existing) {
            return res.status(400).json({
                message: "You are already registered for this event"
            });
        }

        const registeredCount = await Registration.countDocuments({
            event: eventId,
            status: "registered"
        });

        if (registeredCount >= event.capacity) {
            return res.status(400).json({
                message: "Sorry, this event is full"
            });
        }

        const registration = await Registration.create({
            student: req.user.id,
            event: eventId
        });

        res.status(201).json({
            message: "Event registration successful",
            registration
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get logged-in student's registrations
const getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({
            student: req.user.id,
            status: "registered"
        }).populate("event");

        res.status(200).json(registrations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel a registration
const cancelRegistration = async (req, res) => {
    try {
        const registration = await Registration.findOneAndUpdate(
            {
                _id: req.params.id,
                student: req.user.id,
                status: "registered"
            },
            { status: "cancelled" },
            { new: true }
        );

        if (!registration) {
            return res.status(404).json({
                message: "Active registration not found"
            });
        }

        res.status(200).json({
            message: "Registration cancelled successfully",
            registration
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all registrations (Admin only)
const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate("student", "name email")
            .populate("event", "title date venue");

        res.status(200).json(registrations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all controller functions
module.exports = {
    registerForEvent,
    getMyRegistrations,
    cancelRegistration,
    getAllRegistrations
};