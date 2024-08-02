import "../styles/Navprofile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faUser,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Muialert from "./Muialert";
import { useEffect } from "react";

function Navprofile({ setShowprofile, showprofile, closeNavprofile }) {
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility
  const [alertMessage, setAlertMessage] = useState(""); // State to store alert message
  const navigate = useNavigate();

  const fileInputRef = useRef(null); // Ref to the file input element

  const SignOut = async () => {
    const res = await fetch("/api/signout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const jsondata = await res.json();
    if (res.ok) {
      localStorage.clear("Token");
      setAlertMessage(jsondata.message);
      setShowAlert(true);
      navigate("/");
      closeNavprofile(false);
    } else {
      console.error("Failed to logout user");
      setAlertMessage(jsondata.error);
      setShowAlert(true);
    }
  };

  const handlephotoinput = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = async () => {
      const newPhoto = reader.result;

      const res = await fetch("/api/profile-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: localStorage.getItem("Username"),
          photo: newPhoto, // Pass the new photo data correctly
        }),
      });

      const jsondata = await res.json();
      if (res.ok) {
        localStorage.removeItem("Photo");
        localStorage.setItem("Photo", jsondata.user.photo); // Correctly set the new photo in localStorage
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
    fileInputRef.current.click(); // Programmatically click the file input element
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationPanel = document.querySelector(".Navprofilemaindiv");
      if (notificationPanel && !notificationPanel.contains(event.target)) {
        closeNavprofile();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeNavprofile]);

  return (
    <div className="Navprofilemaindiv">
      <div className="Navprofilemaindivcross">
        <span
          onClick={() => {
            setShowprofile(!showprofile);
          }}
        >
          X
        </span>
      </div>
      <div className="Navprofilemaindivdiv1">
        <div className="Navprofilemaindivdiv1div1">
          <img
            onClick={handlePenClick}
            src={localStorage.getItem("Photo")}
            alt=""
          />
          <FontAwesomeIcon
            className="profileediticon"
            icon={faPen}
            onClick={handlePenClick} // Call handlePenClick when the pen icon is clicked
            title="Change Photo"
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handlephotoinput} // Call handlephotoinput when the file input changes
          />
        </div>
        <div className="Navprofilemaindivdiv1div2">
          <p>Hi, {localStorage.getItem("Name")} </p>
          <p>{localStorage.getItem("Username")}</p>
        </div>
      </div>
      <hr style={{ width: "100%" }} />
      <div className="Navprofilemaindivdiv2">
        <button
          onClick={() => {
            navigate("/planetary-path");
          }}
        >
          See My Report
        </button>
        <div className="Navprofilemaindivdiv2div1">
          <button>
            <FontAwesomeIcon icon={faUser} /> <span>Manage</span>
          </button>
          <button onClick={SignOut}>
            <FontAwesomeIcon icon={faRightFromBracket} /> <span>Sign Out</span>
          </button>
        </div>
      </div>
      {showAlert && (
        <Muialert
          message={alertMessage}
          severity="error"
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
}

export default Navprofile;
