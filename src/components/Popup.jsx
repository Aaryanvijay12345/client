import student from '../assets/student.png';
import teacher from '../assets/teacher.png';
import "../styles/Popup.css";


const Popup = () => {



  return (
<div className="box">
     <div className="box2">
      <h2>
        Who are you?
  
      </h2>

     <div className='image1'>
      <img src={student} alt="student" />
      <h3>Student</h3>
      
     </div>


     <div className='image2'>
      <img src={teacher} alt="teacher" />
      <h3>Teacher</h3>
     </div>
     </div>
   
 </div>
  )
}
export default Popup

