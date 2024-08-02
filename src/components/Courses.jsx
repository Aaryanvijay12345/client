import c4 from "../assets/c4.png";
import doubt from "../assets/doubt.png";
import "../styles/Courses.css";
// import "../styles/Navbar.css";
import Navbar from "./Navbar";
import onlineLearning from "../assets/onlineLearning.png";
import table from "../assets/table.png";
import uncle from "../assets/uncle.png";
import examination1 from "../assets/examination1.png";
import extra from "../assets/extra.png";
import class6 from "../assets/class6.png";
import class11 from "../assets/class11.png";
import { NavLink } from "react-router-dom";
import demo from "../assets/demo.png";
import Footer from '../components/Footer'

function Courses() {
  return (

    <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-start"}}> 
      <Navbar/>
    <div className="courses-maindiv">
      <h1 style={{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "50px", marginTop:"40px"}}>Let's Start</h1>
    <div className="demoCourses">
      <div className="doubtSectionCourses">
      <img src={c4} alt=""  style={{height: "20px", marginLeft: "20px"}}/>
      <h1 style={{color: "white", marginLeft: "55px", marginTop: "20px", fontFamily:"cursive"}}>Ask Your Doubts Here....</h1>
      <img src={doubt} alt="" style={{width:"20vw", height:"25vh", marginLeft:"-20px"}}/>
      <h3>Thinking is the art <br />of exploring endless possibilities <br /> within the confines of the mind</h3>
      <NavLink to='/form'><button className="doubtEnroll">Ask Here</button></NavLink>


      </div>
    <div className="freeDemoCourses">
      <img src={c4} alt=""  style={{height: "20px", marginLeft: "20px"}}/>
      <h1 style={{color: "white", marginLeft: "55px", marginTop: "20px", fontFamily:"cursive"}}>Start Your 5 Days Free Demo....</h1>
      <img src={demo} alt="" style={{width:"15vw", height:"25vh", marginLeft:"282px"}} ></img>
      <h3>Dive into a world of knowledge <br /> conveniently from your device,<br /> shaping your future at your pace.</h3>
      <NavLink to='/form'><button className="demoEnroll">Start Now</button></NavLink>
    </div>
    </div>
    {/* <div className="mainCourses"></div> */}

    <div className="text1">
      <span className="white-text">What will you </span>
      <span className="red-text">Learn</span>
      <span className="text"> ?</span>
    </div>

    <div className="images">
      <img src={onlineLearning} alt="" className="zoomable" />
      <img src={table} alt="" className="zoomable" />
      <img src={uncle} alt="" className="zoomable" />
      <img src={examination1} alt="" className="zoomable" />
    </div>

    <div className="text2">
      <span className="white-text1">Courses </span>
      <span className="red-text1">Offered</span>
    </div>

    <div className="imagesCourses">
      <NavLink to="/Class6">
        <img src={class6} alt="" className="zoomable" />
      </NavLink>

      <NavLink to="/Extra">
        <img src={extra} alt="" className="zoomable" />
      </NavLink>

      <NavLink to="/Custom">
        <img src={class11} alt="" className="zoomable" />
      </NavLink>
    </div>
    <div className="animationCourses">
     

    <div className="div1"></div>
    <div className="div2">Enjoy Learning Have Fun 😊</div>
   
    </div>
   
  </div>
  <Footer></Footer>
  </div>

    
  );
}

export default Courses;
