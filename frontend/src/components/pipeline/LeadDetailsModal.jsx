import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Calendar, User, FileText, CheckSquare, MessageSquare, Clock, ShieldAlert } from "lucide-react";

export default function LeadDetailsModal({ lead, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium", dueDate: "" });
  const [timeline, setTimeline] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!lead?._id) return;
    fetchNotes();
    fetchTasks();
    fetchTimeline();
  }, [lead?._id]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leads/${lead._id}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data?.notes || []);
    } catch (err) { console.error(err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leads/${lead._id}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data?.tasks || []);
    } catch (err) { console.error(err); }
  };

  const fetchTimeline = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leads/${lead._id}/timeline`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimeline(res.data?.timeline || []);
    } catch (err) { console.error(err); }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/leads/${lead._id}/notes`, { text: newNote }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewNote("");
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.dueDate) return;
    try {
      await axios.post(`http://localhost:5000/api/leads/${lead._id}/tasks`, newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewTask({ title: "", description: "", priority: "medium", dueDate: "" });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleToggleTask = async (id, currentStatus) => {
    const nextStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { status: nextStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col font-sans text-slate-100 animate-slide-in">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
        <div>
          <h2 className="text-base font-black tracking-wide text-white">{lead.name}</h2>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{lead.email}</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex border-b border-slate-800 bg-slate-900 text-xs font-bold uppercase tracking-wider overflow-x-auto">
        {["overview", "timeline", "notes", "tasks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab ? "border-blue-500 text-blue-400 bg-blue-500/5" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 p-5 overflow-y-auto space-y-5">
        {activeTab === "overview" && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between"><span className="text-slate-400">Current Stage:</span><span className="font-bold text-blue-400 uppercase">{lead.pipelineStage}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Priority Profile:</span><span className="font-bold text-amber-500 uppercase">{lead.priority || "medium"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Lead Source Channel:</span><span className="font-medium text-slate-300">{lead.source || "Web Form"}</span></div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-bold block">Inquiry Message:</span>
              <p className="p-3 bg-slate-950/20 border border-slate-800 rounded-xl text-slate-300 leading-relaxed">{lead.message}</p>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-4">
            {timeline.length === 0 ? <p className="text-xs text-slate-500">No layout change actions tracked.</p> : (
              <div className="relative border-l border-slate-800 ml-2 space-y-4">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-6 text-xs">
                    <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900" />
                    <div className="font-bold text-white">{item.action}</div>
                    <p className="text-slate-400 mt-0.5">{item.description}</p>
                    <span className="text-[10px] text-slate-500 block mt-1">{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-4">
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Type a compliance tracking log note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 rounded-xl transition-colors">Add</button>
            </form>
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note._id} className="p-3 bg-slate-950/30 border border-slate-800/60 rounded-xl text-xs">
                  <p className="text-slate-200 leading-relaxed">{note.text}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                    <span>By: {note.author?.name || "System"}</span>
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-4">
            <form onSubmit={handleAddTask} className="p-3 bg-slate-950/20 border border-slate-800 rounded-xl space-y-2 text-xs">
              <input
                type="text"
                placeholder="Task title details..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-400 outline-none focus:border-blue-500 text-[11px]"
                />
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors">Create Task</button>
              </div>
            </form>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task._id} className="flex items-start gap-3 p-3 bg-slate-950/30 border border-slate-800 rounded-xl">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleToggleTask(task._id, task.status)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs flex-1">
                    <p className={`font-bold text-slate-200 ${task.status === "completed" ? "line-through text-slate-500" : ""}`}>{task.title}</p>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
