import { useEffect, useState } from "react";
import axios from "axios";

export default function AgentLeadsPanel() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/agent/leads", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      setLeads(res.data);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border">
      <h2 className="font-black mb-4">Assigned Leads</h2>

      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead._id} className="border rounded-lg p-4">
            <p className="font-bold">{lead.name}</p>
            <p className="text-xs text-slate-400">{lead.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}