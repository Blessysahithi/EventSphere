const express = require("express");
const router = express.Router();

const {
    registerForEvent,
    getMyRegistrations,
    cancelRegistration,
    getAllRegistrations
} = require("../controllers/registrationController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Student routes
router.post("/", protect, registerForEvent);
router.get("/my", protect, getMyRegistrations);
router.patch("/:id/cancel", protect, cancelRegistration);

// Admin route
router.get("/all", protect, adminOnly, getAllRegistrations);

module.exports = router;