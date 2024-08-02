import { useState } from 'react';
import '../styles/Contact.css';
import Muialert from './Muialert';
// import Navbar from './Navbar';


const Contact = () => {
  const [value, setValue] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    severity: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const PostData = async (e) => {
    e.preventDefault();
    const { name, email, phone, city, message } = value;

    const res = await fetch("/api/contactus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        city,
        message,
      }),
    });

    if (res.ok) {
      setAlert({
        show: true,
        severity: "success",
        message: "Message sent successfully!",
      });
      setValue({ name: "", email: "", phone: "", city: "", message: "" });
    } else {
      setAlert({
        show: true,
        severity: "error",
        message: "Failed to send message",
      });
    }
  };

  return (
    <div>
    <div className='contact-us-page'>

      <div className='cont_page'>
        <h1>Contact &nbsp;<span>us</span></h1>
        <div className='cont_main'>
          <div className='cont_main_div1'>
            <span>Send us a Message</span>
            <div className="cont_form">
              <div className="cont_form-container">
                <form onSubmit={PostData}>
                  <div className="cont_form-group">
                    <label htmlFor="Name">
                      <input
                        placeholder="Name"
                        type="text"
                        id="Name"
                        name="name"
                        value={value.name}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="cont_form-group">
                    <label htmlFor="City">
                      <input
                        placeholder="City"
                        type="text"
                        id="City"
                        name="city"
                        value={value.city}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="cont_form-group">
                    <label htmlFor="phn">

                      <input
                        placeholder="Phone Number"
                        type="tel"
                        id="phn"
                        name="phone"
                        value={value.phone}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="cont_form-group">
                    <label htmlFor="Email">
                      <input
                        placeholder="Email"
                        type="email"
                        id="Email"
                        name="email"
                        value={value.email}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  </div>
                  <div className="cont_form-group">
                    <label htmlFor="message">
                      <textarea
                        placeholder="Message Query"
                        id="message"
                        name="message"
                        value={value.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </label>
                  </div>
                  <div className="cont_form-group">
                    <button type="submit">Send Message</button>
                  </div>
                </form>
                {alert.show && (
                  <Muialert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })}>
                    {alert.message}
                  </Muialert>
                )}

              </div>
            </div>

          </div>
          <div className='cont_main_div2'>
            <div className='cont_all'>
              <div className='cont_all_detail'>
                <h2>How to reach us ?</h2>
                <div className='cont_all_detail_office'>
                  <p>We are open for any suggestion or just to have a chat..</p>

                  <h4>Please Call:-</h4><p><i class="fas fa-phone"></i>&nbsp; 7300-199-100/8949-775-255</p>
                  <h4>Email:-</h4><p><i class="fas fa-envelope"></i>&nbsp;&nbsp;codrueducation@gmail.com</p>
                  <h4>Office:-</h4><p><i class="fas fa-map-marker-alt"></i>&nbsp;&nbsp;Shop No.: 1 & 2, First Floor,Near Ahimsa circle, R.K. Puram (Sector A), Kota (Raj.), 324005</p>
                  <h5>Please reach on Mon-Sun in between (8AM - 8PM)</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Contact;
