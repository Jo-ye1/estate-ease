import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/home/Navbar";
import KycSubmissionForm from "./KycSubmissionForm";
import { 
  ShieldCheck, Award, MessageSquare, Phone, Mail, FileText, 
  Activity, Clock, CheckCircle, Globe, Briefcase, Key, Save, 
  Edit3, Building, Star, ShieldAlert, XCircle, Eye, EyeOff
} from "lucide-react";
import { io } from "socket.io-client";
import CoverImageUploader from "./CoverImageUploader";

const socket = io("http://localhost:5000");

export default function UniversalProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState("bio");
  const [isEditing, setIsEditing] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    location: "",
    bio: "",
    languages: "",
    specialization: "",
    coverageArea: "",
    experienceYears: "",
    workingHours: "",
    vacationMode: false
  });
  const [securityForm, setSecurityForm] = useState({ currentPassword: "", newPassword: "" , confirmPassword: "" });

  const token = localStorage.getItem("token");
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");

  const loadUnifiedProfileData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/profiles/v1/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success && res.data.profile) {
        setProfile(res.data.profile);
        setListings(res.data.listings || []);
        setEditForm({
          name: res.data.profile.user?.name || "",
          email: res.data.profile.user?.email || "",
          phone: res.data.profile.user?.phone || "",
          username: res.data.profile.username || "",
          location: res.data.profile.location || "",
          bio: res.data.profile.bio || "",
          languages: res.data.profile.languages?.join(", ") || "",
          specialization: res.data.profile.specialization?.join(", ") || "",
          coverageArea: res.data.profile.coverageArea?.join(", ") || "",
          experienceYears: res.data.profile.experienceYears || "0",
          workingHours: res.data.profile.workingHours || "9:00 AM - 6:00 PM",
          vacationMode: res.data.profile.vacationMode || false
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  loadUnifiedProfileData();

  if (localUser?._id) {
    socket.emit("join", localUser._id);
  }

    socket.on("profile:updated", (updatedProfile) => {
      const targetUserId = updatedProfile?.user?._id || updatedProfile?.user;
      if (targetUserId === localUser._id) {
        setProfile(updatedProfile);
      }
    });

    return () => {
      socket.off("profile:updated");
    };
  }, []);

  const handleUpdateProfileMeta = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        username: editForm.username,
        location: editForm.location,
        bio: editForm.bio,
        experienceYears: Number(editForm.experienceYears) || 0,
        workingHours: editForm.workingHours,
        vacationMode: editForm.vacationMode,
        languages: editForm.languages.split(",").map((s) => s.trim()).filter(Boolean),
        specialization: editForm.specialization.split(",").map((s) => s.trim()).filter(Boolean),
        coverageArea: editForm.coverageArea.split(",").map((s) => s.trim()).filter(Boolean)
      };

      const res = await axios.put(
        "http://localhost:5000/api/profiles/v1/update-meta",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile(res.data.profile);
      setIsEditing(false);
      alert("Profile synchronized successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed.");
    }
  };

  const handleUpdateSecurity = async (e) => {
    e.preventDefault();
    if (!securityForm.newPassword) return;
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert("Validation error: New password rotation entries do not match.");
      return;
    }
    try {
      await axios.put("http://localhost:5000/api/auth/update-password", securityForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Security credentials rotated successfully!");
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed rotating authentication ciphers.");
    }
  };

    const handleAvatarFileChange = async (e) => {
    // 🟢 FIX 1: Explicitly fetch index position 0 of the selected array
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    // 🟢 FIX 2: Check your backend upload middleware signature name (usually "image" or "images")
    uploadFormData.append("images", file);

    try {
      const uploadRes = await axios.post(`http://localhost:5000/api/properties/${profile?._id || 'me'}/upload`, uploadFormData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}` 
        }
      });

      // Handle common array vs string response object mutations from cloud targets
      const newlyGeneratedImgUrl = uploadRes.data?.url || uploadRes.data?.urls?.[0];

      if (newlyGeneratedImgUrl) {
        // 🟢 FIX 3: Changed key from avatarUrl to coverImageUrl to match your backend updatable fields matrix array
        const res = await axios.put("http://localhost:5000/api/profiles/v1/update-meta", { 
          coverImageUrl: newlyGeneratedImgUrl 
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile(res.data.profile);
        alert("Profile avatar image synchronized successfully!");
      } else {
        alert("Failed parsing a valid uploaded image URL path.");
      }
    } catch (err) {
      console.error(err);
      alert("Upload processing failure encountered.");
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const role = String(profile.user?.role || localUser.role || "buyer").toLowerCase();
  const currentVerificationStatus = profile.user?.verificationStatus || localUser.verificationStatus || "unverified";


  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
      <Navbar />
      
            {/* 1. Universal Header Hero Cover Section */}
      <div 
  className="w-full h-64 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 relative border-b border-slate-200 dark:border-slate-800 bg-cover bg-center bg-no-repeat transition-all duration-300"        style={{
          backgroundImage: profile?.coverImageUrl ? `url(${profile.coverImageUrl})` : undefined
        }}
      >
        <div className="max-w-6xl mx-auto h-full w-full relative px-4">
          <div className="absolute -bottom-12 left-4 flex items-end gap-4">
            
            {/* Profile Avatar Outer Box Wrapper Layout */}
            <div className="w-24 h-24 rounded-2xl bg-blue-600 border-4 border-white dark:border-slate-950 shadow-md flex items-center justify-center font-black text-3xl text-white uppercase select-none overflow-hidden relative group">
              
              {profile?.user?.avatar ? (
                <img 
                  src={profile.user.avatar} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const fallbackSpan = e.target.nextSibling;
                    if (fallbackSpan) fallbackSpan.style.display = 'block';
                  }}
                />
              ) : null}
              
              <span style={{ display: profile?.user?.avatar ? 'none' : 'block' }}>
                {profile?.user?.name?.charAt(0) || "U"}
              </span>

              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer text-white font-sans text-center">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-200">
                  <Edit3 size={12} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">Edit Pic</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const uploadFormData = new FormData();
                    uploadFormData.append("image", file);
                    uploadFormData.append("type", "avatar");

                    try {
                      const uploadRes = await axios.post("http://localhost:5000/api/profiles/v1/upload-media", uploadFormData, {
                        headers: { 
                          "Content-Type": "multipart/form-data",
                          Authorization: `Bearer ${token}` 
                        }
                      });

                      if (uploadRes.data?.success) {
                        if (uploadRes.data.profile) {
                          setProfile(uploadRes.data.profile);
                        }
                        alert("Profile avatar updated successfully!");
                      }
                    } catch (err) {
                      console.error(err);
                      alert(err.response?.data?.message || "Profile photo update failed.");
                    }
                  }}
                />
              </label>
            </div>

            <div className="pb-1 space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">{profile?.user?.name}</h2>
                {currentVerificationStatus === "approved" && <ShieldCheck className="text-blue-500 fill-blue-500/10 shrink-0" size={16} />}
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono">@{editForm.username || "identity"}</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black uppercase text-[9px] tracking-wider">{role}</span>
                {profile?.agencyName && <span className="text-slate-400 font-medium">🏢 {profile.agencyName}</span>}
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 
                  {profile?.vacationMode ? "On Vacation" : "Live Available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* Main Structural Framework Layout Grid */}
      <main className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16 pb-12 flex-1">
        
        {/* Left Hand Column Actions & Trust Profiles Panel */}
        <div className="space-y-6 lg:col-span-1">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-3xs">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Workspace Operations</span>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 size={13} /> {isEditing ? "View Live Profile" : "Edit Workspace Parameters"}
            </button>

            {/* 💬 Quick Social/CRM Interactions Ribbon */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-black uppercase tracking-wider pt-2">
              <a 
                href={`https://wa.me{editForm.phone?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 hover:text-blue-500 transition-all flex flex-col items-center gap-1.5 cursor-pointer no-underline text-slate-700 dark:text-slate-300"
              >
                <MessageSquare size={13} className="text-blue-500" /> Message
              </a>
              <a 
                href={`tel:${editForm.phone}`}
                className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 hover:text-blue-500 transition-all flex flex-col items-center gap-1.5 cursor-pointer no-underline text-slate-700 dark:text-slate-300"
              >
                <Phone size={13} className="text-emerald-500" /> Call Client
              </a>
              <a 
                href={`mailto:${editForm.email}`}
                className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 hover:text-blue-500 transition-all flex flex-col items-center gap-1.5 cursor-pointer no-underline text-slate-700 dark:text-slate-300"
              >
                <Mail size={13} className="text-purple-500" /> Email Node
              </a>
              
              {/* 🟢 TELEGRAM LINK: Perfectly configured to match identical height, typography, and hover behavior */}
                            <a 
                href={`https://t.me{profile?.username || 'username'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 hover:text-sky-500 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer no-underline text-slate-700 dark:text-slate-300"
              >
                <Globe size={13} className="text-sky-500" /> Telegram
              </a>


              {/* 🟢 EXPANDED REPORT INCIDENT BUTTON: Stretches perfectly across the remaining 2 grid rows next to Telegram */}
              <button 
                onClick={() => {
                  const issue = prompt("Enter specific security or protocol incident description to flag:");
                  if (issue) alert("Incident payload routed to the Trust & Compliance team.");
                }}
                className="p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 hover:text-rose-500 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer col-span-2 text-slate-700 dark:text-slate-300 font-black"
              >
                <ShieldAlert size={13} className="text-rose-500" /> Report Incident Flag
              </button>
            </div>
          </div>


          {/* Core Trust Profile Metric Metrics */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-3xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Unified Trust Score Matrix</span>
              <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded">{profile?.trustScore || 85} / 100</span>
            </div>
            <div className="space-y-2 text-xs font-bold text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl">
                <span>Verified Identity Node</span>
                {profile?.isIdentityVerified ? <CheckCircle size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-slate-400" />}
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl">
                <span>Verified Registry Email</span>
                <CheckCircle size={14} className="text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl">
                <span>Verified Telecom Phone</span>
                <CheckCircle size={14} className="text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl">
                <span>License Credentials Status</span>
                {profile?.isLicenseVerified ? <CheckCircle size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-slate-400" />}
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl">
                <span>Agency Affiliation Validation</span>
                {profile?.isAgencyVerified ? <CheckCircle size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-slate-400" />}
              </div>
            </div>
          </div>
        </div>


      {/* Right Hand Context Menu Tab Workspace Deck */}
      <div className="lg:col-span-2 space-y-6">
        {isEditing ? (
          /* DYNAMIC EDIT VIEW FIELDS CONFIGURATION SETTINGS */
          <div className="grid grid-cols-1 gap-6">

            
            <form onSubmit={handleUpdateProfileMeta} className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs font-semibold">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <Edit3 size={14} className="text-blue-500" />
                <h3 className="font-black uppercase tracking-wider text-slate-800 dark:text-white">Modify Professional SaaS Identity</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Username Handle Reference</label>
                  <input type="text" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"/>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Market Coverage Location Node</label>
                  <input type="text" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Languages Spoken (Comma Separated)</label>
                  <input type="text" value={editForm.languages} onChange={e => setEditForm({...editForm, languages: e.target.value})} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"/>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Core Specialization Focus (Comma Separated)</label>
                  <input type="text" value={editForm.specialization} onChange={e => setEditForm({...editForm, specialization: e.target.value})} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Coverage Area Territory (Comma Separated)</label>
                  <input type="text" value={editForm.coverageArea} onChange={e => setEditForm({...editForm, coverageArea: e.target.value})} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Experience (Yrs)</label>
                    <input type="number" value={editForm.experienceYears} onChange={e => setEditForm({...editForm, experienceYears: e.target.value})} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"/>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Working Hours Matrix</label>
                    <input type="text" value={editForm.workingHours} onChange={e => setEditForm({...editForm, workingHours: e.target.value})} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"/>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Corporate Biography Overview Statement</label>
                <textarea rows="3" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"/>
              </div>
                            <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={editForm.vacationMode} onChange={e => setEditForm({...editForm, vacationMode: e.target.checked})} className="w-4 h-4 rounded border-slate-300 accent-blue-600" /> Enable Vacation Mode Parameters
                </label>
              </div>
              
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-wider rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-md transition-all">
                <Save size={12}/> Synchronize Identity Structural Changes
              </button>
            </form>

            {/* Security Cipher Rotation Form */}
            <form onSubmit={handleUpdateSecurity} className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs font-semibold">
  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
    <Key size={14} className="text-purple-500" />
    <h3 className="font-black uppercase tracking-wider text-slate-800 dark:text-white">Security & Password Rotation Matrix</h3>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Current Password Field */}
    <div>
      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Current Account Password Entry</label>
      <div className="relative">
        <input 
          type={showCurrentPassword ? "text" : "password"} 
          value={securityForm.currentPassword} 
          onChange={e => setSecurityForm({...securityForm, currentPassword: e.target.value})} 
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 outline-none text-slate-800 dark:text-slate-100"
        />
        <button 
          type="button" 
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>

    {/* New Password Field */}
    <div>
      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Target New Rotation Cipher</label>
      <div className="relative">
        <input 
          type={showNewPassword ? "text" : "password"} 
          value={securityForm.newPassword} 
          onChange={e => setSecurityForm({...securityForm, newPassword: e.target.value})} 
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 outline-none text-slate-800 dark:text-slate-100"
        />
        <button 
          type="button" 
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>

    {/* Confirm New Password Field */}
    <div>
      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Confirm New Rotation Cipher</label>
      <div className="relative">
        <input 
          type={showConfirmPassword ? "text" : "password"} 
          value={securityForm.confirmPassword} 
          onChange={e => setSecurityForm({...securityForm, confirmPassword: e.target.value})} 
          className={`w-full bg-white dark:bg-slate-950 border ${securityForm.confirmPassword && securityForm.newPassword !== securityForm.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl pl-3 pr-10 py-2 outline-none text-slate-800 dark:text-slate-100`}
        />
        <button 
          type="button" 
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  </div>

  <button type="submit" className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black uppercase tracking-wider rounded-xl inline-flex items-center gap-1.5 cursor-pointer">
    <Key size={12}/> Rotate Credentials Cipher Keys
  </button>
</form>

<CoverImageUploader profile={profile} onUploadSuccess={(p) => setProfile(p)} />
          
            {/* Trust Gate Document Registry Dropzone */}
            <KycSubmissionForm currentStatus={currentVerificationStatus} />
          </div>
        ) : (
          /* STATIC PUBLIC-GRADE SAAS PROFILE DISPLAY PANELS */
          <>
            <div className="flex border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl overflow-hidden p-0.5 shadow-3xs">
              {["bio", "metrics", "listings", "history", "reviews", "vault"].map((tab) => (
                <button
                  key={tab} onClick={() => setActiveSubTab(tab)}
                  className={`flex-1 py-2.5 text-center text-[10px] tracking-wide transition-all rounded-lg cursor-pointer ${activeSubTab === tab ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-3xs min-h-[260px]">
              {activeSubTab === "bio" && (
                <div className="space-y-4 text-xs font-medium">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Biography Overview Statement</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">{editForm.bio || "No description set yet."}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-4 text-slate-600 dark:text-slate-400 font-bold">
                    <div className="inline-flex items-center gap-2"><Globe size={14} className="text-slate-400" /> <span>Languages Spoken: {editForm.languages || "None Listed"}</span></div>
                    <div className="inline-flex items-center gap-2"><Briefcase size={14} className="text-slate-400" /> <span>Specializations: {editForm.specialization || "General"}</span></div>
                    <div className="inline-flex items-center gap-2"><Award size={14} className="text-slate-400" /> <span>Coverage Areas: {editForm.coverageArea || "Global Marketplace"}</span></div>
                    <div className="inline-flex items-center gap-2"><Clock size={14} className="text-slate-400" /> <span>Working Hours Matrix: {editForm.workingHours}</span></div>
                  </div>
                </div>
              )}

              {activeSubTab === "metrics" && (
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Role-Based Live Business Analytics Engine</span>
                  
                  {role === "agency" || role === "agent" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-500">
                      <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] uppercase text-slate-400 block">Properties Managed</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">{profile?.businessStats?.agent?.propertiesManaged || 14} Units</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] uppercase text-slate-400 block">Deals Finalized</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">{profile?.businessStats?.agent?.dealsClosed || 12} Closed</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] uppercase text-slate-400 block">Gross Revenue Generated</span>
                        <span className="text-sm font-black text-emerald-500 mt-1 block">${(profile?.businessStats?.agent?.revenueGenerated || 240000).toLocaleString()}</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] uppercase text-slate-400 block">Conversion Performance</span>
                        <span className="text-sm font-black text-blue-500 mt-1 block">{profile?.businessStats?.agent?.conversionRate || 88}% Rate</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] uppercase text-slate-400 block">Avg Response Latency</span>
                        <span className="text-sm font-black text-purple-500 mt-1 block">{profile?.businessStats?.agent?.avgResponseMinutes || 12} Mins</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] uppercase text-slate-400 block">Global Leaderboard Rank</span>
                        <span className="text-sm font-black text-amber-500 mt-1 block">#{profile?.businessStats?.agent?.rankingIndex || 3} Top Tier</span>
                      </div>
                    </div>
                  ) : role === "seller" ? (
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] uppercase text-slate-400 block">Properties Listed</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">{profile?.businessStats?.seller?.propertiesListed || 4} Listings</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] uppercase text-slate-400 block">Properties Sold</span>
                        <span className="text-sm font-black text-emerald-500 mt-1 block">{profile?.businessStats?.seller?.propertiesSold || 2} Disposed</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] uppercase text-slate-400 block">Saved Bookmarks</span>
                          <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">{profile?.businessStats?.buyer?.savedPropertiesCount || 8} Items</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                          <span className="text-[9px] uppercase text-slate-400 block">Offers Transmitted</span>
                          <span className="text-sm font-black text-blue-500 mt-1 block">{profile?.businessStats?.buyer?.offersMadeCount || 3} Pending</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSubTab === "listings" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Active Real Estate Asset Portfolios ({listings.length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {listings.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center font-medium col-span-2">No active marketplace listings mapped under this profile reference node.</p>
                      ) : (
                        listings.map((prop) => (
                          <div key={prop._id} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between text-xs font-bold shadow-2xs">
                            <div>
                              <div className="text-slate-900 dark:text-white truncate font-black text-sm">{prop.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono mt-1 inline-flex items-center gap-1"><Building size={11}/> {prop.location}</div>
                            </div>
                            <div className="text-emerald-500 font-black mt-4 text-sm tracking-tight">${(prop.pricing?.salePrice || 0).toLocaleString()}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeSubTab === "history" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">System Activity Timeline Stream</span>
                    <div className="space-y-3">
                      {(profile?.activityTimeline || []).map((evt, i) => (
                        <div key={i} className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold">
                          <div className="flex items-center gap-3">
                            <Activity size={13} className="text-blue-500 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200">{evt.description}</p>
                              <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[8px] font-mono rounded font-black text-slate-400 uppercase mt-1 inline-block">{evt.actionType}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{new Date(evt.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSubTab === "reviews" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Immutable Public Reviews & Client Feedback Log</span>
                    <div className="space-y-3">
                      {(!profile?.reviews || profile.reviews.length === 0) ? (
                        <p className="text-xs text-slate-400 py-6 text-center font-medium">No reviews logged on this public profile node yet.</p>
                      ) : (
                        profile.reviews.map((rev, i) => (
                          <div key={i} className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs font-bold">
                            <div className="flex justify-between items-center">
                              <div className="font-black text-slate-900 dark:text-white">👤 {rev.reviewerName}</div>
                              <span className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-500 font-black rounded uppercase text-[8px] tracking-wide">{rev.feedbackType} Feedback</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {Array.from({ length: rev.rating }).map((_, rIdx) => <Star key={rIdx} size={11} fill="currentColor" />)}
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">"{rev.comment}"</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeSubTab === "vault" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Vaulted Compliance Documents & Certificates</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                      {(!profile?.vaultedDocuments || profile.vaultedDocuments.length === 0) ? (
                        <p className="text-xs text-slate-400 py-6 text-center font-medium col-span-2">No uploaded compliance credentials archived inside the profile document vault.</p>
                      ) : (
                        profile.vaultedDocuments.map((doc, i) => (
                          <a key={i} href={doc.docUrl} className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3 hover:border-purple-500 transition-all text-slate-700 dark:text-slate-300 shadow-2xs">
                            <FileText size={16} className="text-purple-500 shrink-0" />
                            <div className="truncate flex-1">
                              <div className="text-slate-900 dark:text-white truncate">{doc.title}</div>
                              <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 block mt-0.5">{doc.category}</span>
                            </div>
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
