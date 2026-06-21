import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ShieldCheck,
  Settings,
  KeyRound,
  Building2,
  Heart,
  MessageSquare,
  User,
  Mail,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Save,
  Lock,
  Grid
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { getMyProperties } from "../services/propertyService";
import PropertyCard from "../components/home/PropertyCard";
import Navbar from "@/components/home/Navbar";
import api from "../lib/api";
import AddReviewForm from "../components/home/AddReviewForm";
import { Eye, EyeOff } from "lucide-react";
import KycSubmissionForm from "./KycSubmissionForm"; // Adjust path to match your folder


export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, login } = useAuth();
  const { favorites, loading: favsLoading } = useFavorites();

  const resolvedUser = user || {};

  const [myProperties, setMyProperties] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fallbackUserObj = JSON.parse(localStorage.getItem("user") || "{}");

  const [profileForm, setProfileForm] = useState({
    name: resolvedUser.name || fallbackUserObj.name || "",
    email: resolvedUser.email || fallbackUserObj.email || "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    resolvedUser.avatar || fallbackUserObj.avatar || ""
  );

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const freshUserObj = JSON.parse(localStorage.getItem("user") || "{}");
    const activeUserName = resolvedUser.name || freshUserObj.name || "";
    const activeUserEmail = resolvedUser.email || freshUserObj.email || "";

    setProfileForm({
      name: activeUserName,
      email: activeUserEmail,
    });

    setAvatarPreview(resolvedUser.avatar || freshUserObj.avatar || "");
  }, [resolvedUser]);

  useEffect(() => {
    const loadOwnerListings = async () => {
      try {
        setListingsLoading(true);
        const data = await getMyProperties();
        setMyProperties(data || []);
      } finally {
        setListingsLoading(false);
      }
    };
    loadOwnerListings();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handleSecurityChange = (e) =>
    setSecurityForm({ ...securityForm, [e.target.name]: e.target.value });

  const handleAvatarFileSelection = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      let updatedAvatarUrl = resolvedUser.avatar || "";

      if (avatarFile) {
        const form = new FormData();
        form.append("image", avatarFile);
        
        const res = await api.post(
          "/auth/upload-avatar", 
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        updatedAvatarUrl = res.data?.image || updatedAvatarUrl;
      }

      const payload = {
        name: profileForm.name.trim(),
        avatar: updatedAvatarUrl,
      };

      const res = await api.put("/auth/profile", payload);
      const updatedUser = res.data?.user || {
        ...resolvedUser,
        ...payload,
      };

      setAvatarPreview(updatedUser.avatar || "");
      localStorage.setItem("user", JSON.stringify(updatedUser));

      login({
        token: localStorage.getItem("token"),
        user: updatedUser,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed updating profile assets.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();

    if (
      !securityForm.currentPassword ||
      !securityForm.newPassword ||
      !securityForm.confirmPassword
    ) {
      return alert("Fill all fields");
    }

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setUpdatingPassword(true);

      await api.put("/auth/update-password", {
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword,
      });

      alert("Password updated");
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Password update exception occurred.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const cleanFavoritesList = (favorites || [])
    .map((f) => f?.property || f)
    .filter(Boolean);

  const activeDataset =
    activeTab === "listings" ? myProperties : cleanFavoritesList;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const paginatedList = activeDataset.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(activeDataset.length / itemsPerPage) || 1;

  const tabLoading = activeTab === "listings" ? listingsLoading : favsLoading;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 pb-24 flex flex-col select-none">
      <Navbar />

      <section className="max-w-[1320px] mx-auto w-full px-4 pt-12 flex-1 flex flex-col justify-start">
        {/* HEADER BRAND BLOCK */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-xs mb-10 text-left">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 overflow-hidden shrink-0 flex items-center justify-center font-black text-xl text-blue-600 dark:text-blue-400">
              {avatarPreview ? (
                <img src={avatarPreview} alt="User Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                profileForm.name[0]?.toUpperCase()
              )}
            </div>

            <div>
              <h1 className="font-black text-xl text-slate-900 dark:text-white tracking-tight leading-none">
                {profileForm.name}
              </h1>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
                <Mail size={12} />
                <span>{profileForm.email}</span>
              </p>
              <span className="text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 mt-2 bg-green-500/10 px-2 py-0.5 rounded-full w-max">
                <ShieldCheck size={12} /> <span>Verified Operator</span>
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={logout} 
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-xl transition-colors border-0 cursor-pointer shadow-2xs shrink-0"
          >
            <LogOut size={14} />
            <span>Logout Session</span>
          </button>
        </div>

        {/* CONTROLS LAYOUT SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          
          {/* LEFT CONTAINER PACK: FORMS COLUMN */}
          <div className="lg:col-span-4 space-y-6 w-full text-left">
            
                        {/* PROFILE CONFIG PANEL */}
                          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
    <Settings size={15} className="text-slate-400" /> <span>Profile Credentials</span>
  </h2>

  <form onSubmit={handleProfileSubmit} className="space-y-3.5">
    <div className="relative w-full h-11">
      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
      <input
        type="text"
        required
        value={profileForm.name || ""}
        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
        placeholder="Enter your name"
        className="w-full h-full pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-white text-xs font-semibold outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
      />
    </div>

    <div className="relative w-full h-11">
      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        value={profileForm.email || ""}
        disabled
        placeholder="System Email"
        className="w-full h-full pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 text-xs font-semibold opacity-60 cursor-not-allowed"
      />
    </div>

    <label className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors cursor-pointer group w-full gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
      <UploadCloud className="w-4 h-4 text-slate-400" />
      <span>Choose Profile Avatar</span>
      <input type="file" accept="image/*" onChange={handleAvatarFileSelection} className="hidden" />
    </label>

    <button 
      type="submit"
      disabled={updatingProfile}
      className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 text-white font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-xs border-0 cursor-pointer flex items-center justify-center gap-2"
    >
      <Save size={14} />
      <span>{updatingProfile ? "Saving Metadata..." : "Save Identity Changes"}</span>
    </button>
  </form>
</div>




            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
    <KeyRound size={15} className="text-slate-400" /> <span>Security Matrix</span>
  </h2>

  <form onSubmit={handleSecuritySubmit} className="space-y-3.5">
    <div className="relative w-full h-11">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type={showCurrentPassword ? "text" : "password"}
        required
        placeholder="Current Account Password"
        name="currentPassword"
        value={securityForm.currentPassword}
        onChange={handleSecurityChange}
        className="w-full h-full pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-transparent outline-none"
      />
      <button
        type="button"
        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-transparent border-0 cursor-pointer outline-none flex items-center justify-center"
      >
        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>

    <div className="relative w-full h-11">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type={showNewPassword ? "text" : "password"}
        required
        placeholder="New Account Password"
        name="newPassword"
        value={securityForm.newPassword}
        onChange={handleSecurityChange}
        className="w-full h-full pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-transparent outline-none"
      />
      <button
        type="button"
        onClick={() => setShowNewPassword(!showNewPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-transparent border-0 cursor-pointer outline-none flex items-center justify-center"
      >
        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
    <div className="relative w-full h-11">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type={showConfirmPassword ? "text" : "password"}
        required
        placeholder="Confirm New Password"
        name="confirmPassword"
        value={securityForm.confirmPassword}
        onChange={handleSecurityChange}
        className="w-full h-full pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-transparent outline-none"
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-transparent border-0 cursor-pointer outline-none flex items-center justify-center"
      >
        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>

    <button
      type="submit"
      disabled={updatingPassword}
      className="w-full h-11 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-800/40 text-white font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-xs border-0 cursor-pointer flex items-center justify-center gap-2"
    >
      <KeyRound size={14} />
      <span>{updatingPassword ? "Dispatching Cipher..." : "Update Security Cipher"}</span>
    </button>
  </form>
</div>

{/* ✅ CRASH FIXED: Set onRefresh to your actual function name or an empty fallback function () => {} */}
<KycSubmissionForm 
  currentStatus={user?.verificationStatus || "unverified"} 
  rejectionReason={user?.kycRejectionReason || ""}
  onRefresh={typeof fetchUser === "function" ? fetchUser : () => {}} 
/>

</div>


          {/* RIGHT CONTAINER PACK: TAB PANEL VISIBILITY COLUMN */}
          <div className="lg:col-span-8 space-y-6 w-full text-left">
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <button 
                type="button"
                onClick={() => setActiveTab("listings")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer transition-all ${activeTab === "listings" ? "bg-blue-600 text-white shadow-xs" : "bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700"}`}
              >
                <Building2 size={14} />
                <span>Your Listings</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setActiveTab("favorites")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer transition-all ${activeTab === "favorites" ? "bg-red-500 text-white shadow-xs" : "bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700"}`}
              >
                <Heart size={14} />
                <span>Your Bookmarks</span>
              </button>
 </div>


            {tabLoading ? (
              <div className="flex justify-center py-20 w-full">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : paginatedList.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/40 w-full flex flex-col items-center justify-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No corresponding entries discovered</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full justify-items-center sm:justify-items-start">
                  {paginatedList.map((item) => (
                    <div key={item._id} className="w-full max-w-[312px]">
                      <PropertyCard item={item} />
                    </div>
                  ))}
                </div>

                {/* INTEGRATED INTERFACE PAGINATION DECK CONTROLS */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 pt-4 w-full border-t border-slate-100 dark:border-slate-900">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-0 outline-none"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div className="text-xs font-mono font-black text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                      Page {currentPage} of {totalPages}
                    </div>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-0 outline-none"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FEEDBACK SECTION */}
        <div className="mt-16 border-t border-slate-200 dark:border-slate-800/80 pt-10 text-left w-full">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">Leave Platform Feedback</h2>
          </div>
          <AddReviewForm />
        </div>
      </section>
    </div>
  );
}
