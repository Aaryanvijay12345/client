import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import notifyicon from "../assets/notification.png";
import c3 from "../assets/c3.png";
import "../styles/Navbar.css";
import Navprofile from "./Navprofile";
import Notification from "./Notification";
import Dashboard from "./Dashboard";

function Navbar() {
  const [showLinks, setShowLinks] = useState(false);
  const [showprofile, setShowprofile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const Showprofile = () => {
    // e.prevent.Default();
    setShowprofile(!showprofile);
    if (showNotifications) {
      setShowNotifications(false);
    }
    setShowLinks(!showLinks);
  };

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showprofile) {
      setShowprofile(false);
    }
    setShowLinks(!showLinks);
  };

  const closeNotification = () => {
    setShowNotifications(false);
  };
  const closeNavprofile = () => {
    setShowprofile(false);
  };
  const toggleDashboard = () => {
    localStorage.setItem("currentView", "dashboard");
    localStorage.setItem("activeTab", "Dashboard");
    setShowDashboard(!showDashboard);
    
  };

  const isLoggedIn = !!localStorage.getItem("Token");

  return (
    <div className="Navbarmaindiv">
      <NavLink to="/" className="navlogo">
        <img src={c3} alt="" />
      </NavLink>
      <div
        className={showLinks ? "navoptions" : "barcross"}
        onClick={toggleLinks}
      >
        <FontAwesomeIcon
          className={showLinks ? "navbarcrossicon" : ""}
          icon={showLinks ? faTimes : faBars}
        />
      </div>
      <div className={`navbuttons ${showLinks ? "show" : ""}`}>
        <div className="btn">
          <NavLink to="/About" className="navlinks">
            About Us
          </NavLink>
          {isLoggedIn ? (
            <NavLink to="/my-courses" className="navlinks">
              My Courses
            </NavLink>
          ) : (
            <NavLink to="/courses" className="navlinks">
              Courses
            </NavLink>
          )}
          <NavLink to="/Contact" className="navlinks">
            Contact Us
          </NavLink>
          <NavLink to="/blog" className="navlinks">
            Blogs
          </NavLink>

          {isLoggedIn && (
            <NavLink
              to="/dashboard"
              className="navlinks"
              onClick={() => {
                toggleDashboard();
              }}
            >
              Dashboard
            </NavLink>
          )}
        </div>
        {isLoggedIn ? (
          <div className="Profileimgmaindiv">
            <NavLink
              className="navnotification"
              onClick={() => {
                toggleNotifications();
              }}
            >
              <img src={notifyicon} alt="" />
            </NavLink>
            <NavLink
              className="navprofile"
              onClick={() => {
                Showprofile();
              }}
            >
              <img src={localStorage.getItem("Photo")} alt="Profile" />
            </NavLink>
          </div>
        ) : (
          <NavLink className="signuplink" to="/signin">
            <button>Sign In</button>
          </NavLink>
        )}
      </div>
      {showprofile && localStorage.getItem("Token") ? (
        <Navprofile
          setShowprofile={setShowprofile}
          showprofile={showprofile}
          closeNavprofile={closeNavprofile}
        />
      ) : (
        ""
      )}
      {showNotifications && localStorage.getItem("Token") ? (
        <Notification
          setShowNotifications={setShowNotifications}
          showNotifications={showNotifications}
          closeNotification={closeNotification}
        />
      ) : (
        ""
      )}
      {showDashboard && localStorage.getItem("Token") ? (
        <Dashboard
          setShowDashboard={setShowDashboard}
          showDashboard={showDashboard}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Navbar;
