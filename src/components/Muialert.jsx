import { useEffect } from "react";
import { Alert as MuiAlert } from "@mui/material";

const Muialert = ({ message, severity, onClose, autoHideDuration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, autoHideDuration);

    return () => clearTimeout(timer); // Clear the timeout if the component is unmounted
  }, [onClose, autoHideDuration]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "9999",
        width: "25%",
      }}
    >
      <MuiAlert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          mb: 2,
          backgroundColor: "black",
          color: "white",
          padding: "2vh",
        }}
      >
        {message}
      </MuiAlert>
    </div>
  );
};

export default Muialert;
