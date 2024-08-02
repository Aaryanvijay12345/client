import React, { useState,useContext } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/SettingsPanel.css";
import { Alert, Snackbar, TextField, Button, IconButton, InputAdornment, Checkbox } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ThemeContext } from "../Theme.jsx"

const username = localStorage.getItem("Username");
const role = localStorage.getItem("Role");

const GeneralSettings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="setting--section">
      <h3 className='setting-my-h3'>Change Theme</h3>
      <div className="setting-form-group">
      <button onClick={() => toggleTheme()}>{theme}</button>
      </div>
    </div>
  );
};

const AccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [showAlert, setShowAlert] = useState(false);
  const [waitingAlert, setWaitingAlert] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword
        })
      });

      if (response.ok) {
        setMessage('Password changed successfully');
      } else {
        setMessage('Error changing password');
      }
    } catch (error) {
      setMessage('Error changing password');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
  
    if (!confirmDelete) {
      return;
    }
  
    setWaitingAlert(true);
  
    try {
      const response = await fetch(`/api/user/${username}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
  
      setWaitingAlert(false);
  
      if (response.ok) {
        localStorage.clear();
        navigate("/");
        setAlertMessage("User deleted successfully");
        setAlertSeverity("success");
        setShowAlert(true);
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setAlertMessage("Failed to delete user");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };
  

  const handleCloseAlert = () => {
    setShowAlert(false);
    setWaitingAlert(false);
  };

  return (
    <div>
    <h4 className='setting-my-h4'>Change Password</h4>
    <div className="setting-function-section">
      <form onSubmit={handlePasswordChange}>
        <div className="setting-form-group">
          <TextField
            label="Current Password"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="setting-form-group">
          <TextField
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Button type="submit" className="change-password-btn" variant="contained" color="primary">Change Password</Button>
      </form>
     
      
      {message && <p>{message}</p>}
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={waitingAlert}
        autoHideDuration={6000}
        onClose={() => setWaitingAlert(false)}
      >
        <Alert
          onClose={() => setWaitingAlert(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          Please wait...
        </Alert>
      </Snackbar>
    </div>
     <div className="setting-function-section">
     <p className="setting-caution-note">Caution: Deleting your account is permanent and cannot be undone.</p>
     <p className="setting-delete-account-text" onClick={handleDeleteAccount}>Delete Account</p>
   </div></div>
  );
};

const NotificationSettings = () => (
  <div>
    <h4 className='setting-my-h4'>Enable Notifications</h4>
    <div className="setting-function-section">
    <div className="setting-form-group">
      <Checkbox
        label="Enable Notifications"
        
        variant="outlined"
        fullWidth
        />
      
    </div>
  </div>
  </div>
  
);

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'account':
        return <AccountSettings />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="settings-panel">
      <h2>Settings</h2>
      <ul className="setting-tabs">
        <li className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>
          General
        </li>
        <li className={activeTab === 'account' ? 'active' : ''} onClick={() => setActiveTab('account')}>
          Account
        </li>
        <li className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
          Notifications
        </li>
      </ul>
      <div className="setting-tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsPanel;