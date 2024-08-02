import { useState, useRef, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import c3 from "../assets/c3.png";
import "../styles/Dashboard.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import RouteIcon from "@mui/icons-material/Route";
import BackpackIcon from "@mui/icons-material/Backpack";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import HomeIcon from "@mui/icons-material/Home";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Admin from "../components/Admin";
import PlanetryPath from "../components/PlanetryPath";
import Savedblogs from "./Savedblogs";
import Admission from "./Admission";
import Profile from "./Profile";
import SettingsPanel from "../components/SettingsPanel";
import Calendar from "./Calendar";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [currentView, setCurrentView] = useState(
    localStorage.getItem("currentView") || "dashboard"
  );
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "Dashboard"
  );

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleAddEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddEvent(newEvent);
    setNewEvent({ title: "", start: new Date(), end: new Date() });
  };

  const fileInputRef = useRef(null);

  const handlePhotoInput = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = async () => {
      const newPhoto = reader.result;

      const res = await fetch("/api/profile-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: localStorage.getItem("Username"),
          photo: newPhoto,
        }),
      });

      const jsondata = await res.json();
      if (res.ok) {
        localStorage.setItem("Photo", jsondata.user.photo);
        setAlertMessage(jsondata.message || "Image updated successfully");
        setShowAlert(true);
        window.location.reload();
      } else {
        setAlertMessage(jsondata.error || "Failed to update image");
        setShowAlert(true);
      }
    };

    reader.readAsDataURL(file);
  };

  const handlePenClick = () => {
    fileInputRef.current.click();
  };

  const SignOut = async () => {
    try {
      const res = await fetch("/api/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const jsondata = await res.json();
      if (res.ok) {
        localStorage.clear();
        setAlertMessage(jsondata.message);
        setShowAlert(true);
        navigate("/");
      } else {
        console.error("Failed to logout user");
        setAlertMessage(jsondata.error);
        setShowAlert(true);
      }
    } catch (error) {
      console.error("An error occurred during logout", error);
    }
  };

  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const role = localStorage.getItem("Role");

  const getDrawerContent = (role, isAdmin) => {
    const items = [
      {
        text: "Home",
        icon: <HomeIcon />,
        path: "/",
      },
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        view: "dashboard",
      },

      {
        text: "Profile",
        icon: <PersonIcon />,
        view: "profile",
      },
      {
        text: "Settings",
        icon: <SettingsIcon />,
        view: "settings",
      },
      {
        text: "My Blogs",
        icon: <RssFeedIcon />,
        view: "my-blogs",
        path: "/my-blogs",
      },
      {
        text: "Saved Blogs",
        icon: <BookmarksIcon />,
        view: "saved-blogs"
      }
    ];

    if (role === "Teacher" || role === "Student") {
      items.push({
        text: "My Courses",
        icon: <BackpackIcon />,
        view: "my-courses",
      });
    }

    if (role === "Student") {
      items.push({
        text: "Report",
        icon: <RouteIcon />,
        view: "report",
      });
    }

    if (isAdmin) {
      items.push({
        text: "Manage Users",
        icon: <ManageAccountsIcon />,
        view: "manage-users",
      });
    }

    return (
      <List sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
        {items.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              if (item.path) {
                handleNavigation(item.path);
              } else {
                setCurrentView(item.view);
                setActiveTab(item.text);
                localStorage.setItem("currentView", item.view);
                localStorage.setItem("activeTab", item.text);
              }
            }}
            selected={activeTab === item.text}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button key="Logout" sx={{ marginBottom: 5 }} onClick={SignOut}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    );
  };

  useEffect(() => {
    const savedView = localStorage.getItem("currentView");
    const savedTab = localStorage.getItem("activeTab");

    if (savedView) setCurrentView(savedView);
    if (savedTab) setActiveTab(savedTab);
  }, []);

  let arrlen = events.length;

  return (
    <div className="mainDashboard">
      <div className="leftSectionDashboard">
        <NavLink to="/">
          <img src={c3} alt="codrudivision" className="codrudivision" />
        </NavLink>

        <div className="photoDashboard">
          <img
            src={localStorage.getItem("Photo")}
            alt="User"
            className="dashboard-image"
          />
          <FontAwesomeIcon
            className="myphotoedit"
            icon={faPen}
            onClick={handlePenClick}
            title="Change Photo"
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handlePhotoInput}
          />
          <div className="welcomeMessage">
            <h2>Welcome {localStorage.getItem("Username")}!</h2>
          </div>
        </div>

        <div className="drawerContent">{getDrawerContent(role, isAdmin)}</div>
      </div>

      <div className="rightSectionDashboard">
        {currentView === "profile" && (
          <div>
            <Profile />
          </div>
        )}
        {currentView === "dashboard" && (
          <div>
            <Calendar />
          </div>
        )}
        {currentView === "settings" && (
          <div>
            <SettingsPanel />
          </div>
        )}
        {currentView === "my-courses" && <div>My Courses Content</div>}
        {currentView === "saved-blogs" && <Savedblogs />}
        {currentView === "my-blogs" && <div>My Blogs Content</div>}
        {currentView === "report" && <PlanetryPath />}
        {currentView === "manage-users" && <Admin />}
      </div>
    </div>
  );
};

export default Dashboard;
