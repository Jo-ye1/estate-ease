import { useEffect, useState } from "react";
import axios from "axios";

export default function AgentActivityTimeline() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/activities/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      setActivities(res.data);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border">
      <h2 className="font-black mb-4">Activity Timeline</h2>

      <div className="space-y-3">
        {activities.map((item) => (
          <div key={item._id} className="border-l-2 border-blue-600 pl-4">
            <p className="font-bold">{item.title}</p>
            <p className="text-xs text-slate-400">{item.actionType}</p>
          </div>
        ))}
      </div>
    </div>
  );
}