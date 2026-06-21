import { useEffect, useState } from "react";
import axios from "axios";

export default function AgentTaskBoard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/agent/tasks", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      setTasks(res.data);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border">
      <h2 className="font-black mb-4">Tasks</h2>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task._id} className="border p-4 rounded-lg">
            <p className="font-bold">{task.title}</p>
            <p className="text-xs">{task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}