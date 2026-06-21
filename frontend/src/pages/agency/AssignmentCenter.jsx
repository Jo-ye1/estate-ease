import React, { useState } from 'react';
import { Search, UserPlus, ShieldAlert, Award, Briefcase, ChevronRight } from 'lucide-react';

export default function AssignmentCenter({ initialLeads = [], initialAgents = [], onAssign }) {
  const [leads, setLeads] = useState(initialLeads);
  const [agents] = useState(initialAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  // Filter leads to find unassigned items matching search criteria
  const filteredLeads = leads.filter(lead => 
    !lead.agentId && 
    (lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAssignmentExecute = async (agentId, priority = 'MEDIUM') => {
    if (!selectedLead) return;

    // Fire callback or internal API request here
    await onAssign(selectedLead._id, agentId, priority);

    // Optimistically update local view state
    setLeads(prev => prev.filter(l => l._id !== selectedLead._id));
    setSelectedLead(null);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-6 font-sans">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Assignment & Workload Hub</h1>
        <p className="text-xs text-slate-400">Match incoming platform leads to balanced enterprise agents instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: UNASSIGNED LEAD QUEUE (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-[75vh]">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search unassigned client pool..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredLeads.map(lead => (
              <div
                key={lead._id}
                onClick={() => setSelectedLead(lead)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedLead?._id === lead._id 
                    ? 'bg-blue-950/40 border-blue-500 shadow' 
                    : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white">{lead.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{lead.email}</p>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-mono text-slate-300">
                    Score: {lead.leadScore}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Source: <b className="text-slate-400">{lead.leadSource}</b></span>
                  <ChevronRight size={12} className={selectedLead?._id === lead._id ? 'text-blue-400' : 'text-slate-600'} />
                </div>
              </div>
            ))}
            {filteredLeads.length === 0 && (
              <div className="text-center text-slate-500 text-xs py-8">No unassigned leads found.</div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE TEAM WORKLOAD BALANCER & ACTION PANEL (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedLead ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="border-b border-slate-800 pb-3 mb-4">
                <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Target Assignment</span>
                <h2 className="text-sm font-bold text-white mt-1">Routing Lead: <span className="text-blue-400">{selectedLead.name}</span></h2>
              </div>

              <h3 className="text-xs font-semibold text-slate-400 mb-3">Select Target Agent by Real-Time Bandwidth:</h3>
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                {agents.map(agent => {
                  // Compute dynamic workload metrics safely
                  const workloadPct = Math.min(100, Math.round(((agent.activeLeads * 1.5) + (agent.activeListings * 2)) / 50 * 100));
                  
                  let progressColor = 'bg-green-500';
                  if (workloadPct > 50) progressColor = 'bg-amber-500';
                  if (workloadPct > 80) progressColor = 'bg-rose-500';

                  return (
                    <div key={agent._id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                          <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'ONLINE' ? 'bg-green-500' : 'bg-slate-600'}`} />
                          <span className="text-[9px] bg-slate-800 text-amber-400 px-1 rounded flex items-center gap-0.5">
                            <Award size={10} /> {agent.tier || 'Gold Agent'}
                          </span>
                        </div>
                        
                        {/* Dynamic Progress/Capacity Metrics Bar */}
                        <div className="mt-2 w-full max-w-xs">
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Workload Capacity</span>
                            <span className="font-mono font-bold">{workloadPct}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${progressColor}`} style={{ width: `${workloadPct}%` }} />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><Briefcase size={11} /> {agent.activeListings} Properties</span>
                          <span>👥 {agent.activeLeads} Active Leads</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAssignmentExecute(agent._id)}
                        disabled={agent.status !== 'ONLINE' || workloadPct >= 95}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start md:self-center transition-colors shadow-sm"
                      >
                        <UserPlus size={13} />
                        Assign Target
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center h-[75vh]">
              <ShieldAlert className="text-slate-600 mb-2" size={28} />
              <h3 className="text-xs font-bold text-slate-300">No Target Selection</h3>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1">Select an incoming lead from the left pane queue column to trigger the automatic matching layout.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
