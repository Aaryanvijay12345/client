// import "../styles/Profile.css";

// import profilelogo from "../assets/signUp.png";
// import profile from "../assets/userprofile.jpeg";
// import dashboard from "../assets/dashboard.jpeg";
// import courses from "../assets/courses.jpeg";
// import activity from "../assets/activity.jpeg";
// import Userprofile from "./Userprofile";

// const Profile = () => {

//   const handleheading = (prop) => {

//   };
//   return (
//     <div className="profile">
//       <div className="profilecont">
//         <div className="profilecontdiv1">
//           <img className="profilelogo" src={profilelogo} alt="" />
//           <div onClick={() => handleheading("Profile")}>
//             <img src={profile} alt="" />
//             <p>Profile</p>
//           </div>
//           <div onClick={() => handleheading("Courses")}>
//             <img src={courses} alt="" />
//             <p>Courses</p>
//           </div>
//           <div onClick={() => handleheading("Dashboard")}>
//             <img src={dashboard} alt="" />
//             <p>Dashboard</p>
//           </div>
//           <div onClick={() => handleheading("Activity")}>
//             <img src={activity} alt="" />
//             <p>Activity</p>
//           </div>
//         </div>
//         <div className="profilecontdiv2">
//           <Userprofile />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import { useState, useEffect } from "react";
import "../styles/Admission.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    address: "",
    userphoto: "",
    usersign: "",
    userparentsign: "",
    gender: "",
    phone: "",
    altphone: "",
    declaration: false,
    classorsem: "",
    chosensubs: ["", "", "", "", "", ""],
    schoolorcollege: "",
    semorclg: "",
    fatherName: "",
    fatherOcc: "",
    motherName: "",
    motherOcc: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const storedUsername = localStorage.getItem("Username");
      if (!storedUsername) {
        console.error("name not found in localStorage");
        return;
      }

      try {
        const res = await fetch(`/api/students/${storedUsername}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlefileinput = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const newPhoto = reader.result;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: newPhoto,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (name.startsWith("Subject_Choosen")) {
      const index = parseInt(name.replace("Subject_Choosen", ""), 10);
      const subjects = [...formData.chosensubs];
      subjects[index] = value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        chosensubs: subjects,
      }));
    } else if (type === "checkbox") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admission", {
        // Adjust the URL as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const jsondata = await res.json();
        console.log(jsondata);
        window.alert("Data submitted successfully");
      } else {
        console.log("Error submitting data");
        window.alert("Submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("An error occurred while submitting the form");
    }
  };

  return (
    <div className="Admission-form-container">
      <form onSubmit={handleSubmit}>
        <table
          className="form-table"
          align="center"
          cellPadding="20"
          cellSpacing="20"
        >
          <tbody>
            <tr>
              <td>
                <b>Name:</b>
              </td>
              <td colSpan="3">
                <input type="text" name="name" value={formData.name} disabled />
              </td>
            </tr>
            <tr>
              <td>
                <b>Date of Birth:</b>
              </td>
              <td colSpan="3">
                <input type="date" name="dob" value={formData.dob} disabled />
              </td>
            </tr>
            <tr>
              <td>
                <b>Gender:</b>
              </td>
              <td>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  disabled
                />{" "}
                Male
              </td>
              <td>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  disabled
                />{" "}
                Female
              </td>
              <td>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === "Other"}
                  disabled
                />{" "}
                Other
              </td>
            </tr>
            <tr>
              <td>
                <b>Address:</b>
              </td>
              <td colSpan="3">
                <input
                  type="text"
                  placeholder="Present Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>Email id:</b>
              </td>
              <td colSpan="3">
                <input
                  type="email"
                  placeholder="Email id"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>Phone No.:</b>
              </td>
              <td colSpan="3">
                <input
                  type="tel"
                  placeholder="Phone No."
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>Alternate Phone No.:</b>
              </td>
              <td colSpan="3">
                <input
                  type="tel"
                  placeholder="Alternate Phone No."
                  name="altphone"
                  value={formData.altphone}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>Subject Choosen:</b>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Subject Choosen"
                  name="Subject_Choosen0"
                  value={formData.chosensubs[0]}
                  disabled
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Subject Choosen"
                  name="Subject_Choosen1"
                  value={formData.chosensubs[1]}
                  disabled
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Subject Choosen"
                  name="Subject_Choosen2"
                  value={formData.chosensubs[2]}
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <input
                  type="text"
                  placeholder="Subject Choosen"
                  name="Subject_Choosen3"
                  value={formData.chosensubs[3]}
                  disabled
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Subject Choosen"
                  name="Subject_Choosen4"
                  value={formData.chosensubs[4]}
                  disabled
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Subject Choosen"
                  name="Subject_Choosen5"
                  value={formData.chosensubs[5]}
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>Class:</b>
              </td>
              <td colSpan="3">
                <select name="classorsem" value={formData.classorsem} disabled>
                  <option value="" disabled>
                    Select class
                  </option>
                  <option value="6">6th</option>
                  <option value="7">7th</option>
                  <option value="8">8th</option>
                  <option value="9">9th</option>
                  <option value="10">10th</option>
                  <option value="11">11th</option>
                  <option value="12">12th</option>
                  <option value="13">Undergraduate</option>
                </select>
              </td>
            </tr>
            {formData.classorsem === "13" && (
              <tr>
                <td>
                  <b>Semester:</b>
                </td>
                <td colSpan="3">
                  <select name="semorclg" value={formData.semorclg} disabled>
                    <option value="" disabled>
                      Select Semester
                    </option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                  </select>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <b>School/College:</b>
              </td>
              <td colSpan="3">
                <input
                  type="text"
                  placeholder="School/College"
                  name="schoolorcollege"
                  value={formData.schoolorcollege}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>Father's Name:</b>
              </td>
              <td colSpan="3">
                <input
                  type="text"
                  placeholder="Father's Name"
                  name="fatherName"
                  value={formData.fatherName}
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>Father's Occupation:</b>
              </td>
              <td colSpan="3">
                <input
                  type="text"
                  placeholder="Father's Occupation"
                  name="fatherOcc"
                  value={formData.fatherOcc}
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>Mother's Name:</b>
              </td>
              <td colSpan="3">
                <input
                  type="text"
                  placeholder="Mother's Name"
                  name="motherName"
                  value={formData.motherName}
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>Mother's Occupation:</b>
              </td>
              <td colSpan="3">
                <input
                  type="text"
                  placeholder="Mother's Occupation"
                  name="motherOcc"
                  value={formData.motherOcc}
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>User Photo:</b>
              </td>
              <td colSpan="3">
                <label htmlFor="userphoto">change photo</label>
                <input
                  type="file"
                  name="userphoto"
                  id="userphoto"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlefileinput}
                />
                {formData.userphoto && (
                  <img
                    src={formData.userphoto}
                    alt="User Photo Preview"
                    style={{ maxWidth: "200px", marginTop: "10px" }}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <b>User Signature:</b>
              </td>
              <td colSpan="3">
                <input
                  type="file"
                  name="usersign"
                  accept="image/*"
                  style={{ display: "none" }}
                  // onChange={handleFileInput}
                />
                {formData.usersign && (
                  <img
                    src={formData.usersign}
                    alt="User Signature Preview"
                    style={{ maxWidth: "200px", marginTop: "10px" }}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td>
                <b>Parent's Signature:</b>
              </td>
              <td colSpan="3">
                <input
                  type="file"
                  name="userparentsign"
                  accept="image/*"
                  style={{ display: "none" }}
                  // onChange={handleFileInput}
                />
                {formData.userparentsign && (
                  <img
                    src={formData.userparentsign}
                    alt="Parent Signature Preview"
                    style={{ maxWidth: "200px", marginTop: "10px" }}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td colSpan="4">
                <input
                  type="checkbox"
                  name="declaration"
                  checked={formData.declaration}
                  // onChange={handleChange}
                  // required
                />{" "}
                I do hereby declare that all the information provided above is
                true to my knowledge.
              </td>
            </tr>
            <tr>
              <td colSpan="4" align="center">
                <button type="submit">Update Profile</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default Profile;
