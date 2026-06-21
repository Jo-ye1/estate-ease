import { useEffect, useState } from "react";
import axios from "axios";

const CalendarDashboardPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await axios.get("/api/calendar/my");
    setEvents(data.events);
  };

  return (
    <div>
      <h2>My Calendar</h2>

      {events.map((event) => (
        <div key={event._id}>
          <h3>{event.title}</h3>
          <p>{event.eventType}</p>
          <p>{new Date(event.startDate).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CalendarDashboardPage;