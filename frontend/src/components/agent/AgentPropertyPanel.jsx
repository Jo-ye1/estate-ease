import { useEffect, useState } from "react";
import axios from "axios";

export default function AgentPropertyPanel() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/agent/properties", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      setProperties(res.data);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border">
      <h2 className="font-black mb-4">Assigned Properties</h2>

      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property._id} className="border rounded-lg p-4">
            <p className="font-bold">{property.title}</p>
            <p className="text-xs">{property.listingStatus}</p>
          </div>
        ))}
      </div>
    </div>
  );
}