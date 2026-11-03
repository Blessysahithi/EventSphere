import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Users } from "lucide-react";
import API from "../services/api";

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        API.get(`/events/${id}`)
            .then((response) => setEvent(response.data))
            .catch(() => setMessage("Unable to load event details."))
            .finally(() => setLoading(false));
    }, [id]);

    const handleRegister = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setRegistering(true);
            setMessage("");

            await API.post(
                "/registrations",
                { eventId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("Successfully registered for this event!");
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setRegistering(false);
        }
    };

    if (loading) return <p>Loading event details...</p>;
    if (!event) return <p>{message || "Event not found."}</p>;

    return (
        <div className="event-details">
            <h1>{event.title}</h1>
            <span className="category">{event.category}</span>
            <p>{event.description}</p>

            <div className="event-info">
                <p><CalendarDays size={18} /> {new Date(event.date).toLocaleDateString("en-IN")} at {event.time}</p>
                <p><MapPin size={18} /> {event.venue}</p>
                <p><Users size={18} /> Capacity: {event.capacity}</p>
            </div>

            <p><strong>Organizer:</strong> {event.organizer}</p>

            <button
                className="register-btn"
                onClick={handleRegister}
                disabled={registering}
            >
                {registering ? "Registering..." : "Register Now"}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default EventDetails;