import { useEffect, useState } from "react";
import io from "socket.io-client";
import "../styles/Notification.css";
import "../styles/Spinner.css";

const username = "GK";

const Notification = ({
  closeNotification,
  showNotifications,
  setShowNotifications,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [dismissing, setDismissing] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) {
      setError("Username is required");
      return;
    }

    fetchNotifications();
    const socket = io("http://localhost:3000");
    socket.emit("join", username);

    socket.on("notification", (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  const fetchNotifications = async () => {
    setLoading(false); // Start loading
    try {
      const response = await fetch("http://localhost:3000/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernames: [username] }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setNotifications(data[username] ? data[username].reverse() : []);
      setLoading(true); // End loading
    } catch (err) {
      setError("Failed to fetch notifications");
      setNotifications([]);
      setLoading(true); // End loading even on error
    }
  };

  const timeAgo = (date) => {
    const now = Date.now();
    const diff = Math.floor((now - new Date(date).getTime()) / 1000);

    if (diff < 60) {
      return `${diff} seconds ago`;
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)} minutes ago`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)} hours ago`;
    } else {
      return `${Math.floor(diff / 86400)} days ago`;
    }
  };

  const dismissNotification = (index) => {
    setDismissing((prevDismissing) => [...prevDismissing, index]);
    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index)
      );
      setDismissing((prevDismissing) =>
        prevDismissing.filter((i) => i !== index)
      );
    }, 500);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationPanel = document.querySelector(".notification-panel");
      if (notificationPanel && !notificationPanel.contains(event.target)) {
        closeNotification();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeNotification]);

  return (
    <div className="notification-panel">
      <h3>Notifications</h3>
      <span
        className="notification-panelcross"
        onClick={() => {
          setShowNotifications(!showNotifications);
        }}
      >
        X
      </span>
      <hr />
      {error && <p>{error}</p>}
      <ul>
        {!loading ? (
          <div className="spinner-container">
            <div className="ios-spinner"></div>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li
              key={index}
              className={`notification-item ${
                dismissing.includes(index) ? "fade-out" : ""
              }`}
            >
              <p>{notification.message}</p>
              <small>{timeAgo(notification.date)}</small>
              <button
                className="dismiss-button"
                onClick={() => dismissNotification(index)}
              >
                ×
              </button>
            </li>
          ))
        ) : (
          <p>No new notification</p>
        )}
      </ul>
    </div>
  );
};

export default Notification;
