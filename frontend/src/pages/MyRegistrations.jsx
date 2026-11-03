import { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import API from "../services/api";

function MyRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        API.get("/registrations/my", config)
            .then((response) => setRegistrations(response.data))
            .catch(() => setError("Unable to load your registrations."))
            .finally(() => setLoading(false));
    }, []);

    const handleUnregister = async (id) => {
        if (!window.confirm("Are you sure you want to unregister from this event?")) {
            return;
        }

        try {
            await API.patch(`/registrations/${id}/cancel`, {}, config);

            setRegistrations((previous) =>
                previous.filter((item) => item._id !== id)
            );

            setMessage("Successfully unregistered from the event!");
        } catch (error) {
            setMessage(error.response?.data?.message || "Unable to unregister.");
        }
    };

    if (loading) return <p>Loading your registrations...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="events-section">
            <div className="section-heading">
                <div>
                    <span className="section-label">YOUR ACTIVITIES</span>
                    <h2>My Registrations</h2>
                    <p>Events you have registered for.</p>
                </div>
            </div>

            {message && <p>{message}</p>}

            {registrations.length === 0 ? (
                <p>You haven't registered for any events yet.</p>
            ) : (
                <div className="event-grid">
                    {registrations.map((item) => (
                        <div className="event-card" key={item._id}>
                            <div className="event-content">
                                <h3>{item.event?.title}</h3>
                                <span className="category">{item.event?.category}</span>
                                <p>{item.event?.description}</p>

                                <div className="event-info">
                                    <span>
                                        <CalendarDays size={16} />
                                        {item.event?.date &&
                                            new Date(item.event.date).toLocaleDateString("en-IN")}
                                    </span>

                                    <span>
                                        <MapPin size={16} />
                                        {item.event?.venue}
                                    </span>
                                </div>

                                <p>Status: <strong>{item.status}</strong></p>

                                <button
                                    className="unregister-btn"
                                    onClick={() => handleUnregister(item._id)}
                                >
                                    Unregister
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyRegistrations;