import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddEvent() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        venue: "",
        organizer: "",
        capacity: "",
        image: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            await API.post(
                "/events",
                { ...formData, capacity: Number(formData.capacity) },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setMessage("Event created successfully!");
            setTimeout(() => navigate("/admin-dashboard"), 1200);

        } catch (error) {
            setMessage(error.response?.data?.message || "Unable to create event.");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="events-section">
            <div className="section-heading">
                <div>
                    <span className="section-label">ADMIN PANEL</span>
                    <h2>Add New Event</h2>
                    <p>Enter the details of your college event.</p>
                </div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <input name="title" placeholder="Event Title" value={formData.title} onChange={updateField} required />

                <textarea name="description" placeholder="Event Description" value={formData.description} onChange={updateField} required />

                <input name="category" placeholder="Category (Workshop, Hackathon...)" value={formData.category} onChange={updateField} required />

                <input type="date" name="date" value={formData.date} onChange={updateField} required />

                <input name="time" placeholder="Time (e.g. 10:00 AM)" value={formData.time} onChange={updateField} required />

                <input name="venue" placeholder="Venue" value={formData.venue} onChange={updateField} required />

                <input name="organizer" placeholder="Organizer" value={formData.organizer} onChange={updateField} required />

                <input type="number" name="capacity" placeholder="Event Capacity" min="1" value={formData.capacity} onChange={updateField} required />

                <input name="image" placeholder="Image URL (optional)" value={formData.image} onChange={updateField} />

                <button type="submit" disabled={loading}>
                    {loading ? "Creating Event..." : "Create Event"}
                </button>

                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default AddEvent;