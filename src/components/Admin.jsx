import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Dialog, DialogContent, Alert, Snackbar } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";

function matchIsString(text) {
  return typeof text === "string";
}

function matchIsNumeric(text) {
  const isNumber = typeof text === "number";
  const isString = matchIsString(text);
  return (isNumber || (isString && text !== "")) && !isNaN(Number(text));
}

const validateChar = (value, index) => {
  return matchIsNumeric(value);
};

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({ otp: "" });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [showAlert, setShowAlert] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [waitingAlert, setWaitingAlert] = useState(false); // State for waiting alert
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const mappedData = data.map((user, index) => ({
          id: index,
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          photo: user.photo,
          isAdmin: user.isAdmin,
        }));

        setUsers(mappedData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id, username, role) => {
    const confirmDelete = window.confirm(
      `This will remove "${username}" from your organization. Press OK to proceed.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/user/${username}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      setAlertMessage("User deleted successfully");
      setAlertSeverity("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Error deleting user:", error);
      setAlertMessage("Failed to delete user");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  const handleAssignTask = (username) => {
    navigate(`/add-task/${username}`);
  };

  const handleBro = async (username, isAdmin) => {
    try {
      setWaitingAlert(true); // Show waiting alert
      const response = await fetch(`/api/generate-otp-bro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          isAdmin: isAdmin,
        }),
      });
      setWaitingAlert(false); // Hide waiting alert
      if (response.ok) {
        console.log("Success");
        setCurrentUsername(username);
        setOpen(true);
        setValue((prevValue) => ({ ...prevValue, otp: "" }));
      } else {
        console.error("Retry");
        setAlertMessage("Failed to generate OTP");
        setAlertSeverity("error");
        setShowAlert(true);
      }
    } catch (error) {
      setWaitingAlert(false); // Hide waiting alert in case of error
      console.error("Error: ", error);
      setAlertMessage("Error occurred while generating OTP");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  const handleOtpVerification = async (username, finalValue) => {
    console.log(finalValue);

    const res = await fetch("/api/verify-bigbro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, otp: finalValue }),
    });

    if (res.ok) {
      const jsonresponse = await res.json();
      console.log("OTP verified successfully");
      setValue((prevValue) => ({
        ...prevValue,
        isEmailVerified: true,
      }));
      setOpen(false);
      setAlertMessage(jsonresponse.message);
      setAlertSeverity("success");
      setShowAlert(true);
      window.location.reload(false);
    } else {
      const jsonresponse = await res.json();
      setAlertMessage(jsonresponse.error);
      setAlertSeverity("error");
      setShowAlert(true);
      console.error("Failed to verify OTP");
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleOtpChange = (otp) => {
    setValue((prevValue) => ({
      ...prevValue,
      otp: otp,
    }));
  };

  const handleComplete = (finalValue) => {
    handleOtpVerification(currentUsername, finalValue);
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "isAdmin",
      headerName: "Is Admin?",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="actions-container">
          {params.row.role === "Student" && (
            <button
              onClick={() => handleAssignTask(params.row.username)}
              className="assign-task-button"
              title="Assign Task"
            >
              <AssignmentIcon fontSize="medium" />
            </button>
          )}
          {params.row.isAdmin === true ? (
            <button
              onClick={() => handleBro(params.row.username, params.row.isAdmin)}
              className="remove-admin-button"
              title="Revoke Admin Privileges"
            >
              <RemoveCircleIcon fontSize="medium" />
            </button>
          ) : (
            <button
              onClick={() => handleBro(params.row.username, params.row.isAdmin)}
              className="make-admin-button"
              title="Grant Admin Privileges"
            >
              <AddCircleIcon fontSize="medium" />
            </button>
          )}
          <button
            onClick={() =>
              handleDelete(params.row.id, params.row.username, params.row.role)
            }
            className="delete-button"
            title="Delete User"
          >
            <DeleteIcon fontSize="medium" />
          </button>
        </div>
      ),
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer style={{ marginLeft: "1vw" }}>
        <GridToolbar />
        <GridToolbarQuickFilter style={{ width: "30%" }} />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <DataGrid
        sx={{ padding: "30px" }}
        rows={users}
        columns={columns}
        pageSize={5}
        loading={loading}
        slots={{
          toolbar: CustomToolbar,
        }}
        ignoreDiacritics
      />

      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setOpen(false);
          }
        }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
        PaperProps={{
          style: {
            padding: "20px",
            borderRadius: "10px",
          },
        }}
      >
        <DialogContent>
          <MuiOtpInput
            length={4}
            autoFocus
            onComplete={handleComplete}
            value={value.otp}
            onChange={handleOtpChange}
            display="flex"
            gap={3}
            validateChar={validateChar}
            TextFieldsProps={{
              style: { width: "50px", height: "50px" },
              placeholder: "-",
            }}
          />
        </DialogContent>
      </Dialog>
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
  );
}
