import { useEffect, useState } from "react";
import axios from "axios";

export default function AgentCommissionPanel() {
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/agent/commissions", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      setCommissions(res.data);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border">
      <h2 className="font-black mb-4">Commissions</h2>

      <div className="space-y-4">
        {commissions.map((commission) => (
          <div key={commission._id} className="border rounded-lg p-4">
            <p className="font-bold">${commission.amount}</p>
            <p className="text-xs">{commission.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}