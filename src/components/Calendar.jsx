import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import "../styles/Dashboard.css";
import "../styles/Calendar.css";
import DeleteIcon from '@mui/icons-material/Delete';

const calendarStyles = {
  width: '70%',
  maxWidth: '1000px',
  margin: '40px 100px 0px 0px',
  border: '1px solid #ccc',
  padding: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  fontSize: '0.8em',
  height: '80vh',
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAdmin, setIsAdmin] = useState(JSON.parse(localStorage.getItem('isAdmin')) || false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = async () => {
    try {
      console.log('Checking authorization...');
      const response = await fetch('http://localhost:3000/api/calendar/check-auth');
      const data = await response.json();
      console.log('Authorization response:', data);

      if (data.authorized) {
        setAuthorized(true);
        fetchEvents();
      } else {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error checking authorization:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/calendar/events');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Handle the error appropriately in your UI
    }
  };

  const addEvent = async (event) => {
    if (!isAdmin) {
      console.error('Unauthorized: Only admins can add events.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/calendar/add-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      const data = await response.json();
      setEvents([...events, data]);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const removeEvent = async (event) => {
    if (!isAdmin) {
      console.error('Unauthorized: Only admins can remove events.');
      return;
    }

    try {
      await fetch(`http://localhost:3000/api/calendar/del-events/${event.id}`, {
        method: 'DELETE',
      });

      setEvents(events.filter(e => e.id !== event.id));
      closeModal();
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  const handleDateSelect = (selectInfo) => {
    if (isAdmin) {
      const title = prompt('Please enter a title for your event');
      if (title) {
        const event = {
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
        };
        addEvent(event);
      }
    } else {
      alert('No event is scheduled.');
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      meetLink: clickInfo.event.extendedProps.meetLink,
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  if (!authorized) {
    return <div>Loading...</div>;
  }

  return (
    <div className='calendarMainDiv'>
      <div className='calendarEventSection' style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={calendarStyles}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            editable={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            height="80vh"
          />
        </div>
      </div>

      {selectedEvent && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Event Details"
          className="event-modal"
          overlayClassName="event-overlay"
        >
          {isAdmin && (
            <button
              onClick={() => removeEvent(selectedEvent)}
              className="remove-button"
              title="Delete Event"
            >
              <DeleteIcon fontSize="medium" />
            </button>
          )}
          <h3>{selectedEvent.title}</h3>
          <div className="event-times">
            <p>Start: {new Date(selectedEvent.start).toLocaleTimeString()}</p>
            <p>End: {new Date(selectedEvent.end).toLocaleTimeString()}</p>
          </div>
          {selectedEvent.meetLink && (
            <a href={selectedEvent.meetLink} className="meet-button" target="_blank" rel="noopener noreferrer">
              Join Google Meet
            </a>
          )}
          <button onClick={closeModal} className="close-button">Close</button>
        </Modal>
      )}
    </div>
  );
};

export default Calendar;


// import React, { useState, useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import Modal from 'react-modal';
// import "../styles/Dashboard.css";
// import "../styles/Calendar.css";
// import DeleteIcon from '@mui/icons-material/Delete';

// const calendarStyles = {
//   // ... (unchanged)
// };

// const Calendar = () => {
//   const [events, setEvents] = useState([]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(JSON.parse(localStorage.getItem('isAdmin')) || false);
//   const [authorized, setAuthorized] = useState(false);

//   useEffect(() => {
//     checkAuthorization();
//   }, []);

//   const checkAuthorization = async () => {
//     try {
//       console.log('Checking authorization...');
//       const response = await fetch('http://localhost:3000/api/calendar/check-auth');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log('Authorization response:', data);

//       if (!data.authorized) {
//         window.location.href = data.authUrl;
//         return;
//       }

//       setAuthorized(true);
//       fetchEvents();
//     } catch (error) {
//       console.error('Error checking authorization:', error);
//       setError('Failed to check authorization. Please try again later.');
//     }
//   };


//   const fetchEvents = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/api/calendar/events');
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch events');
//       }
//       const data = await response.json();
//       setEvents(data);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       // You might want to show an error message to the user here
//     }
//   };

//   const addEvent = async (event) => {
//     if (!isAdmin) {
//       console.error('Unauthorized: Only admins can add events.');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:3000/api/calendar/events', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(event),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to add event');
//       }

//       const data = await response.json();
//       setEvents([...events, data]);
//     } catch (error) {
//       console.error('Error adding event:', error);
//       // You might want to show an error message to the user here
//     }
//   };

//   const removeEvent = async (event) => {
//     if (!isAdmin) {
//       console.error('Unauthorized: Only admins can remove events.');
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3000/api/calendar/events/${event.id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to remove event');
//       }

//       setEvents(events.filter(e => e.id !== event.id));
//       closeModal();
//     } catch (error) {
//       console.error('Error removing event:', error);
//       // You might want to show an error message to the user here
//     }
//   };

//   // ... (handleDateSelect, handleEventClick, and closeModal remain unchanged)

//   if (!authorized) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className='calendarMainDiv'>
// //       <div className='calendarEventSection' style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
// //         <div style={calendarStyles}>
// //           <FullCalendar
//             plugins={[dayGridPlugin, interactionPlugin]}
//             initialView="dayGridMonth"
//             selectable={true}
//             editable={true}
//             events={events}
//             select={handleDateSelect}
//             eventClick={handleEventClick}
//             height="80vh"
//           />
//         </div>
//       </div>

//       {selectedEvent && (
//         <Modal
//           isOpen={modalIsOpen}
//           onRequestClose={closeModal}
//           contentLabel="Event Details"
//           className="event-modal"
//           overlayClassName="event-overlay"
//         >
//           {isAdmin && (
//             <button
//               onClick={() => removeEvent(selectedEvent)}
//               className="remove-button"
//               title="Delete Event"
//             >
//               <DeleteIcon fontSize="medium" />
//             </button>
//           )}
//           <h3>{selectedEvent.title}</h3>
//           <div className="event-times">
//             <p>Start: {new Date(selectedEvent.start).toLocaleTimeString()}</p>
//             <p>End: {new Date(selectedEvent.end).toLocaleTimeString()}</p>
//           </div>
//           {selectedEvent.meetLink && (
//             <a href={selectedEvent.meetLink} className="meet-button" target="_blank" rel="noopener noreferrer">
//               Join Google Meet
//             </a>
//           )}
//           <button onClick={closeModal} className="close-button">Close</button>
//         </Modal>
//       )}
//     </div>
  
//   );
// };

// export default Calendar;