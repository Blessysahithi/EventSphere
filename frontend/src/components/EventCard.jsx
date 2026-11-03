
import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function EventCard({ event }) {
    return (
        <div className="event-card">

            {event.image ? (
                <img
                    src={event.image}
                    alt={event.title}
                    className="event-image"
                />
            ) : (
                <div className="event-image event-image-placeholder">
                    <CalendarDays size={40} />
                </div>
            )}

            <div className="event-content">
                <span className="category">{event.category}</span>

                <h3>{event.title}</h3>

                <p>{event.description}</p>

                <div className="event-info">
                    <span>
                        <CalendarDays size={16} />
                        {new Date(event.date).toLocaleDateString("en-IN")}
                    </span>

                    <span>
                        <MapPin size={16} />
                        {event.venue}
                    </span>
                </div>

                <Link
                    to={`/events/${event._id}`}
                    className="register-btn"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}

export default EventCard;
