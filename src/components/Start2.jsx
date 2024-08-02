import bookImage from "../assets/books.jpg";
import "../styles/Start2.css";
function Start2() {
  return (
    <div className="Start2">
      <div className="Start2div1">
        <h2>Get Started With Our Courses...</h2>
        <p>Available Online,Offline and Hybrid---</p>
      </div>
      <div className="Start2div2">
        <div>
          <img src={bookImage} alt="" />

          <p>
            <h3>All Subjects</h3>
            <span>(Class 6-12.B.Tech)</span>
          </p>
        </div>
        <div>
          <img src={bookImage} alt="" />
          <p>Skill Developement</p>
        </div>
        <div>
          <img src={bookImage} alt="" />
          <p>Customize Your Course</p>
        </div>
      </div>
    </div>
  );
}

export default Start2;
