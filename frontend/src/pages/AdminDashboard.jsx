
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    CalendarDays, Users, ClipboardList,
    MapPin, Pencil, Trash2, Plus
} from "lucide-react";
import API from "../services/api";

function AdminDashboard() {
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, registrationRes] = await Promise.all([
                    API.get("/events"),
                    API.get("/registrations/all", config)
                ]);

                setEvents(eventRes.data);
                setRegistrations(registrationRes.data);
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) {
            return;
        }

        try {
            await API.delete(`/events/${id}`, config);
            setEvents(prev => prev.filter(event => event._id !== id));
            alert("Event deleted successfully!");
        } catch (error) {
            alert(error.response?.data?.message || "Unable to delete event.");
        }
    };

    const activeEvents = events.filter(
        event => new Date(event.date) >= new Date(new Date().toDateString())
    ).length;

    if (loading) return <p className="dashboard-loading">Loading dashboard...</p>;

    return (
        <div className="admin-dashboard">

            {/* Dashboard Heading */}
            <div className="dashboard-header">
                <div>
                    <span className="section-label">ADMIN PANEL</span>
                    <h1>Admin Dashboard</h1>
                    <p>Manage your college events and student registrations.</p>
                </div>

                <Link to="/add-event" className="add-event-btn">
                    <Plus size={19} /> Add New Event
                </Link>
            </div>

            {/* Statistics */}
            <div className="dashboard-stats">

                <div className="dashboard-stat-card">
                    <div className="stat-icon purple">
                        <CalendarDays size={25} />
                    </div>
                    <div>
                        <p>Total Events</p>
                        <h2>{events.length}</h2>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="stat-icon blue">
                        <Users size={25} />
                    </div>
                    <div>
                        <p>Total Registrations</p>
                        <h2>{registrations.length}</h2>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="stat-icon green">
                        <ClipboardList size={25} />
                    </div>
                    <div>
                        <p>Upcoming Events</p>
                        <h2>{activeEvents}</h2>
                    </div>
                </div>

            </div>

            {/* Manage Events */}
            <section className="admin-section">
                <div className="admin-section-heading">
                    <div>
                        <h2>Manage Events</h2>
                        <p>View and manage all college events.</p>
                    </div>
                    <span>{events.length} Events</span>
                </div>

                {events.length === 0 ? (
                    <p className="dashboard-empty">No events available.</p>
                ) : (
                    <div className="admin-event-list">
                        {events.map(event => (
                            <div className="admin-event-card" key={event._id}>
                                <div className="admin-event-info">
                                    <h3>{event.title}</h3>
                                    <span>{event.category}</span>
                                    <p>
                                        <MapPin size={15} />
                                        {event.venue}
                                    </p>
                                </div>

                                <div className="admin-event-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => navigate(`/edit-event/${event._id}`)}
                                    >
                                        <Pencil size={15} /> Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(event._id)}
                                    >
                                        <Trash2 size={15} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Student Registrations */}
            <section className="admin-section">
                <div className="admin-section-heading">
                    <div>
                        <h2>Student Registrations</h2>
                        <p>View students registered for college events.</p>
                    </div>
                    <span>{registrations.length} Registrations</span>
                </div>

                {registrations.length === 0 ? (
                    <p className="dashboard-empty">
                        No student registrations available.
                    </p>
                ) : (
                    <div className="registration-list">
                        {registrations.map(item => (
                            <div className="registration-card" key={item._id}>
                                <div className="student-avatar">
                                    {(item.student?.name || "U").charAt(0).toUpperCase()}
                                </div>

                                <div className="registration-info">
                                    <h3>{item.student?.name || "Unknown Student"}</h3>
                                    <p>{item.student?.email || "N/A"}</p>
                                    <strong>
                                        {item.event?.title || "Event unavailable"}
                                    </strong>
                                    <p>
                                        <MapPin size={14} />
                                        {item.event?.venue || "N/A"}
                                    </p>
                                </div>

                                <span className={`status-badge ${item.status}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}

export default AdminDashboard;
