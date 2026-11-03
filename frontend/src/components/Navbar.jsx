
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, Menu, X } from "lucide-react";

function Navbar() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            setUser(JSON.parse(localStorage.getItem("user")));
        } catch {
            setUser(null);
        }
        setMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setMenuOpen(false);
        navigate("/login");
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <Link to="/" className="logo" onClick={closeMenu}>
                <CalendarDays size={28} />
                <span>EventSphere</span>
            </Link>

            <div className={`nav-links ${menuOpen ? "active" : ""}`}>
                <Link to="/" onClick={closeMenu}>Home</Link>
                <Link to="/#events" onClick={closeMenu}>Explore Events</Link>

                {user?.role === "student" && (
                    <Link to="/my-registrations" onClick={closeMenu}>
                        My Registrations
                    </Link>
                )}

                {user?.role === "admin" && (
                    <Link to="/admin-dashboard" onClick={closeMenu}>
                        Admin Dashboard
                    </Link>
                )}

                {user ? (
                    <>
                        <span>Welcome, {user.name} ({user.role})</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={closeMenu}>Login</Link>
                        <Link to="/register" onClick={closeMenu}>Get Started</Link>
                    </>
                )}
            </div>

            <button
                className="mobile-menu"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
            >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
        </nav>
    );
}

export default Navbar;
