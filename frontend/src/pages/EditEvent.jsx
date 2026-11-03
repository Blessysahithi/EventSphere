
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditEvent() {
    const { id } = useParams();
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

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Fetch existing event details
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await API.get(`/events/${id}`);
                const event = response.data;

                setFormData({
                    title: event.title || "",
                    description: event.description || "",
                    category: event.category || "",
                    date: event.date
                        ? new Date(event.date).toISOString().split("T")[0]
                        : "",
                    time: event.time || "",
                    venue: event.venue || "",
                    organizer: event.organizer || "",
                    capacity: event.capacity || "",
                    image: event.image || ""
                });
            } catch (error) {
                setMessage("Unable to load event details.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Update event
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await API.put(
                `/events/${id}`,
                {
                    ...formData,
                    capacity: Number(formData.capacity)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Event updated successfully!");
            navigate("/admin-dashboard");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to update event."
            );
        }
    };

    if (loading) return <p>Loading event...</p>;

    return (
        <div className="events-section">
            <div className="section-heading">
                <div>
                    <span className="section-label">ADMIN PANEL</span>
                    <h2>Edit Event</h2>
                    <p>Update your event details.</p>
                </div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <input name="title" value={formData.title}
                    onChange={handleChange} placeholder="Event Title" required />

                <textarea name="description" value={formData.description}
                    onChange={handleChange} placeholder="Description" required />

                <input name="category" value={formData.category}
                    onChange={handleChange} placeholder="Category" required />

                <input type="date" name="date" value={formData.date}
                    onChange={handleChange} required />

                <input name="time" value={formData.time}
                    onChange={handleChange} placeholder="Time" required />

                <input name="venue" value={formData.venue}
                    onChange={handleChange} placeholder="Venue" required />

                <input name="organizer" value={formData.organizer}
                    onChange={handleChange} placeholder="Organizer" required />

                <input type="number" name="capacity" min="1"
                    value={formData.capacity} onChange={handleChange}
                    placeholder="Capacity" required />

                <input name="image" value={formData.image}
                    onChange={handleChange} placeholder="Image URL" />

                <button type="submit">Update Event</button>

                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default EditEvent;
