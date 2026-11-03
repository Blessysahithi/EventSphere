
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Users, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import EventCard from "../components/EventCard";

function Home() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    API.get("/events")
      .then((res) => setEvents(res.data))
      .catch(() => setError("Unable to load events. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (location.hash === "#events") {
      const timer = setTimeout(() => {
        document.getElementById("events")?.scrollIntoView({
          behavior: "smooth"
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  const scrollToEvents = () => {
    document.getElementById("events")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const categories = ["All", ...new Set(events.map((event) => event.category))];

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || event.category === category)
  );

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">✨ Discover. Connect. Celebrate.</span>

          <h1>
            Every Event Has
            <br />
            A <span>Story</span> To Tell.
          </h1>

          <p>
            Discover exciting college events, workshops,
            hackathons and cultural fests.
            Be part of something amazing!
          </p>

          <button className="hero-btn" onClick={scrollToEvents}>
            Explore Events <ArrowRight size={18} />
          </button>

          <div className="hero-stats">
            <div>
              <CalendarDays size={22} />
              <strong>Events</strong>
              <small>Discover more</small>
            </div>

            <div>
              <Users size={22} />
              <strong>Community</strong>
              <small>Connect together</small>
            </div>
          </div>
        </div>
      </section>

      <section className="events-section" id="events">
        <div className="section-heading">
          <div>
            <span className="section-label">WHAT'S HAPPENING?</span>
            <h2>Upcoming Events</h2>
            <p>Find events that match your interests.</p>
          </div>
        </div>

        <div className="event-filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {loading && <p>Loading events...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && filteredEvents.length === 0 && (
          <p>No matching events found.</p>
        )}

        {!loading && !error && (
          <div className="event-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
