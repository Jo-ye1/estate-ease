import { useEffect, useState } from "react";
import axios from "axios";

const AgencyCalendarPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data } = await axios.get("/api/calendar/agency");
    setEvents(data.events);
  };

  return (
    <div>
      <h2>Agency Calendar</h2>

      {events.map((event) => (
        <div key={event._id}>
          <h3>{event.title}</h3>
          <p>{event.assignedTo?.name}</p>
          <p>{new Date(event.startDate).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default AgencyCalendarPage;