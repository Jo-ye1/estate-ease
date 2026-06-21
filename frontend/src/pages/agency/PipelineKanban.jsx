import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Navbar from "@/components/home/Navbar";
import { socket } from "@/lib/socket";
import LeadDetailsModal from "@/components/pipeline/LeadDetailsModal";

const PIPELINE_COLUMNS = [
  { id: "new", title: "New Leads" },
  { id: "contacted", title: "Contacted" },
  { id: "viewing", title: "Viewing Scheduled" },
  { id: "negotiation", title: "Negotiation" },
  { id: "offer", title: "Offer Made" },
  { id: "contract", title: "Contract Signed" },
  { id: "closed", title: "Closed Won" },
  { id: "lost", title: "Lost" }
];

export default function PipelineKanban() {
  const [pipeline, setPipeline] = useState({ new: [], contacted: [], viewing: [], negotiation: [], offer: [], contract: [], closed: [], lost: [] });
  const [kpis, setKpis] = useState({ new: 0, contacted: 0, viewing: 0, negotiation: 0, offer: 0, contract: 0, closed: 0, lost: 0, conversionRate: 0, revenue: 0 });
  const [filters, setFilters] = useState({ search: "", priority: "all", source: "all", stage: "all", budgetMax: "" });
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const loadPipelineData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("http://localhost:5000/api/agency/leads/pipeline", { headers: { Authorization: `Bearer ${token}` } });
      const analyticsRes = await axiosInstance.get("http://localhost:5000/api/agency/leads/pipeline-analytics", { headers: { Authorization: `Bearer ${token}` } });
      
      if (res.data?.success && res.data?.pipeline) setPipeline(res.data.pipeline);
      if (analyticsRes.data?.success && analyticsRes.data?.metrics) setKpis(analyticsRes.data.metrics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipelineData();
    socket.on("pipeline:update", loadPipelineData);
    return () => { socket.off("pipeline:update", loadPipelineData); };
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    const sourceLeads = [...(pipeline[sourceColId] || [])];
    const destLeads = [...(pipeline[destColId] || [])];
    const [movedLead] = sourceLeads.splice(source.index, 1);

    if (sourceColId === destColId) {
      sourceLeads.splice(destination.index, 0, movedLead);
      setPipeline(prev => ({ ...prev, [sourceColId]: sourceLeads }));
    } else {
      destLeads.splice(destination.index, 0, movedLead);
      setPipeline(prev => ({ ...prev, [sourceColId]: sourceLeads, [destColId]: destLeads }));

      try {
        await axiosInstance.put(`http://localhost:5000/api/agency/leads/pipeline/${draggableId}/stage`, { stage: destColId }, { headers: { Authorization: `Bearer ${token}` } });
        socket.emit("pipeline:update");
      } catch (err) {
        console.error(err);
        loadPipelineData();
      }
    }
  };

  const getFilteredLeads = (laneId) => {
    return (pipeline[laneId] || []).filter(lead => {
      const matchesSearch = lead.name?.toLowerCase().includes(filters.search.toLowerCase()) || lead.email?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesPriority = filters.priority === "all" || lead.priority === filters.priority;
      const matchesSource = filters.source === "all" || lead.source === filters.source;
      const leadPrice = lead.property?.pricing?.salePrice || lead.property?.pricing?.monthlyRent || 0;
      const matchesBudget = !filters.budgetMax || leadPrice <= parseFloat(filters.budgetMax);
      return matchesSearch && matchesPriority && matchesSource && matchesBudget;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col"><Navbar />
        <div className="flex-1 flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 selection:bg-blue-500/30">
      <div className="p-4 md:p-6 flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl m-4 shadow-sm">
        <div className="mb-4">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">Deal Pipeline Control Panel</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Track conversions, manage customer interaction lifecycles, and move leads through operational channels.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4 bg-slate-50 dark:bg-slate-900/40 p-3 border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs shadow-xs">
          <input type="text" placeholder="🔍 Search name, email..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100" />
          <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 text-slate-600 dark:text-slate-400">
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select value={filters.source} onChange={e => setFilters({...filters, source: e.target.value})} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 text-slate-600 dark:text-slate-400">
            <option value="all">All Channels</option>
            <option value="property_contact_form">Property Form</option>
            <option value="landing_page">Landing Page</option>
          </select>
          <input type="number" placeholder="💰 Enter max budget..." value={filters.budgetMax} onChange={e => setFilters({...filters, budgetMax: e.target.value})} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-5">
          {[
            { label: "New Leads", value: kpis.new, color: "text-blue-600 dark:text-blue-400" },
            { label: "Viewing", value: kpis.viewing, color: "text-amber-600 dark:text-amber-400" },
            { label: "Negotiation", value: kpis.negotiation, color: "text-purple-600 dark:text-purple-400" },
            { label: "Closed Won", value: kpis.closed, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Lost Dropouts", value: kpis.lost, color: "text-rose-600 dark:text-rose-400" },
            { label: "Conversion", value: `${kpis.conversionRate || 0}%`, color: "text-teal-600 dark:text-teal-400" },
            { label: "Pipeline Value", value: `$${(kpis.revenue || 0).toLocaleString()}`, color: "text-emerald-600 dark:text-emerald-400" }
          ].map((kpi, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-center shadow-xs">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">{kpi.label}</span>
              <h3 className={`text-base font-black mt-0.5 ${kpi.color}`}>{kpi.value}</h3>
            </div>
          ))}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-320px)] items-start">
            {PIPELINE_COLUMNS.map((col) => {
              const currentLeads = getFilteredLeads(col.id);
              return (
                <div key={col.id} className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl min-w-[290px] max-w-[290px] max-h-full shadow-md">
                  <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900/40 rounded-t-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">{col.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-extrabold">{currentLeads.length}</span>
                  </div>
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps} ref={provided.innerRef}
                        className={`flex-1 p-2.5 gap-2.5 overflow-y-auto space-y-2.5 min-h-[150px] transition-colors duration-150 rounded-b-xl ${snapshot.isDraggingOver ? "bg-slate-100 dark:bg-slate-800/20" : "bg-transparent"}`}
                      >
                        {currentLeads.map((lead, index) => (
                          <Draggable key={lead._id} draggableId={lead._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                onClick={() => setSelectedLead(lead)}
                                className={`p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-xs transition-all duration-150 cursor-pointer ${snapshot.isDragging ? "border-blue-500 bg-slate-100 dark:bg-slate-700 shadow-xl scale-[1.02]" : "hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/80"}`}
                              >
                                <div className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">{lead.name || "Anonymous Contact"}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-2 rounded-lg border border-slate-200 dark:border-slate-800/40">{lead.message || "No initial text query."}</div>
                                {lead.property && (
                                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-2 truncate bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10 dark:border-blue-500/20">
                                    🏠 {lead.property.title || "Unknown Listing Asset"}
                                  </div>
                                )}
                                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/40 flex justify-between items-center text-[10px]">
                                  <span className="text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Handler Agent:</span>
                                  <span className="font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md">
                                    👤 {lead.assignedAgent?.name || lead.owner?.name || "Unassigned Staff"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => {
            setSelectedLead(null);
            loadPipelineData();
          }}
        />
      )}
    </div>
  );
}
