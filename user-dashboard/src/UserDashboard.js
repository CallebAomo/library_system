import { useState, useEffect } from "react";
import { Home, Search, BookOpen, Bell, User, Info } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import BookSearch from "./components/BookSearch";
import HomeSection from "./components/HomeSection";
import BorrowedBooks from "./components/BorrowedBooks";
import StudentProfileForm from "./components/StudentProfileForm";
import StaffProfileForm from "./components/StaffProfileForm";
import PopularBooks from "./components/PopularBooks";
import Notifications from "./components/Notifications";

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isStaff, setIsStaff] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/settings/announcements");
        setAnnouncements(response.data);
      } catch (err) {
        setError("Failed to load announcements: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "search":
        return <BookSearch />;
      case "home":
        return <HomeSection onSectionChange={handleSectionChange} announcements={announcements} />;
      case "borrowed":
        return <BorrowedBooks />;
      case "popular":
        return <PopularBooks />;
      case "notifications":
        return <Notifications announcements={announcements} loading={loading} error={error} />;
      case "profile":
        return (
          <div>
            <div className="mb-3">
              <button
                className={`btn me-2 ${!isStaff ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setIsStaff(false)}
              >
                Student Profile
              </button>
              <button
                className={`btn ${isStaff ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setIsStaff(true)}
              >
                Staff Profile
              </button>
            </div>
            {isStaff ? <StaffProfileForm /> : <StudentProfileForm />}
          </div>
        );
      case "about":
        return (
          <div>
            <h2>About UOE Library</h2>
            <p>
              The University of Excellence Library, established in 1965, is a cornerstone of academic excellence in East Africa. 
              With over 50,000 books, journals, and digital resources, we serve students, staff, and researchers across the region. 
              Our mission is to provide access to knowledge and foster a culture of learning and innovation.
            </p>
            <h4>Our Vision</h4>
            <p>To be the leading academic library in East Africa, empowering communities through knowledge.</p>
          </div>
        );
      case "library-hours":
        return (
          <div>
            <h2>Library Hours (EAT, UTC+3)</h2>
            <ul className="list-group">
              <li className="list-group-item">Monday: 8:00 AM - 8:00 PM</li>
              <li className="list-group-item">Tuesday: 8:00 AM - 8:00 PM</li>
              <li className="list-group-item">Wednesday: 8:00 AM - 8:00 PM</li>
              <li className="list-group-item">Thursday: 8:00 AM - 8:00 PM</li>
              <li className="list-group-item">Friday: 8:00 AM - 8:00 PM</li>
              <li className="list-group-item">Saturday: 9:00 AM - 4:00 PM</li>
              <li className="list-group-item">Sunday: 9:00 AM - 4:00 PM</li>
            </ul>
            <p className="mt-3 text-muted">Note: Hours may vary during public holidays. Check notifications for updates.</p>
          </div>
        );
      case "contact-us":
        return (
          <div>
            <h2>Contact Us</h2>
            <p>We’re here to assist you with any inquiries. Reach out through the following channels:</p>
            <ul className="list-unstyled">
              <li><strong>Email:</strong> library@uoe.edu</li>
              <li><strong>Phone:</strong> +254 703 222 222</li>
              <li><strong>WhatsApp:</strong> +254 703 222 222 (Mon-Fri, 9 AM - 5 PM EAT)</li>
              <li><strong>Physical Address:</strong> UOE Library, P.O. Box 123, Eldoret, Kenya</li>
            </ul>
            <p className="mt-3">For urgent issues, visit the library front desk during operating hours.</p>
          </div>
        );
      case "faq":
        return (
          <div>
            <h2>Frequently Asked Questions (FAQ)</h2>
            <div className="accordion" id="faqAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                    How do I borrow a book?
                  </button>
                </h2>
                <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    Use the "My Borrowed Books" section to request a book. You’ll need your student/staff ID.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                    What if I lose a book?
                  </button>
                </h2>
                <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    Report it to library@uoe.edu or visit the front desk. A replacement fee may apply.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                    Can I access e-books?
                  </button>
                </h2>
                <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    Yes, log in to our digital portal via the website with your library credentials.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                    How long can I keep a book?
                  </button>
                </h2>
                <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    The standard loan period is 14 days. Extensions can be requested via the dashboard.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <HomeSection onSectionChange={handleSectionChange} announcements={announcements} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container-fluid flex-grow-1">
        <div className="row">
          {/* Sidebar */}
          <aside
            className="col-md-3 bg-dark text-white p-3"
            style={{ position: "fixed", height: "100vh", overflowY: "auto" }}
          >
            <h2 className="text-center mb-4">Library Dashboard</h2>
            <nav className="nav flex-column">
              <button
                className={`btn mb-2 ${activeSection === "home" ? "btn-primary" : "btn-outline-light"}`}
                onClick={() => setActiveSection("home")}
              >
                <Home className="me-2" /> Home
              </button>
              <button
                className={`btn mb-2 ${activeSection === "search" ? "btn-primary" : "btn-outline-light"}`}
                onClick={() => setActiveSection("search")}
              >
                <Search className="me-2" /> Book Search
              </button>
              <button
                className={`btn mb-2 ${activeSection === "popular" ? "btn-primary" : "btn-outline-light"}`}
                onClick={() => setActiveSection("popular")}
              >
                <BookOpen className="me-2" /> Popular Books
              </button>
              <button
                className={`btn mb-2 ${activeSection === "borrowed" ? "btn-primary" : "btn-outline-light"}`}
                onClick={() => setActiveSection("borrowed")}
              >
                <BookOpen className="me-2" /> My Borrowed Books
              </button>
              <button
                className={`btn mb-2 ${activeSection === "notifications" ? "btn-primary" : "btn-outline-light"}`}
                onClick={() => setActiveSection("notifications")}
              >
                <Bell className="me-2" /> Notifications
              </button>
              <button
                className={`btn mb-2 ${activeSection === "profile" ? "btn-primary" : "btn-outline-light"}`}
                onClick={() => setActiveSection("profile")}
              >
                <User className="me-2" /> Profile
              </button>
              <button
                className={`btn mb-2 ${activeSection === "about" ? "btn-primary" : "btn-outline-light"}`}
                onClick={() => setActiveSection("about")}
              >
                <Info className="me-2" /> About
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="col-md-9 p-4" style={{ marginLeft: "25%" }}>
            {renderSection()}
          </main>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-dark text-white py-4 mt-auto" style={{ borderTop: "3px solid #007bff" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5 className="text-primary mb-3">UOE Library</h5>
              <p className="small">
                Empowering knowledge since 1965<br />
                Over 50,000 books and counting
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h5 className="text-primary mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <button
                    className="btn text-white text-decoration-none hover-effect p-0"
                    onClick={() => setActiveSection("library-hours")}
                  >
                    Library Hours
                  </button>
                </li>
                <li>
                  <button
                    className="btn text-white text-decoration-none hover-effect p-0"
                    onClick={() => setActiveSection("contact-us")}
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    className="btn text-white text-decoration-none hover-effect p-0"
                    onClick={() => setActiveSection("faq")}
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h5 className="text-primary mb-3">Get in Touch</h5>
              <p className="small">
                Email: library@uoe.edu<br />
                Phone: +254 703 222 222<br />
                WhatsApp: +254 703 222 222<br />
                <span className="text-muted">Version 2.1.0</span>
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center pt-3 border-top border-secondary">
              <p className="mb-0 small">
                © {new Date().getFullYear()} University of Excellence Library System. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .hover-effect:hover {
          color: #007bff !important;
          transition: color 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;