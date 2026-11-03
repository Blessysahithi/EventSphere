
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import MyRegistrations from "./pages/MyRegistrations";
import AdminDashboard from "./pages/AdminDashboard";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/my-registrations" element={<MyRegistrations />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/add-event" element={<AddEvent />} />
                <Route path="/edit-event/:id" element={<EditEvent />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
