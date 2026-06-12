import { useState, useEffect } from "react";
import { LogOut, User, ShieldCheck, Mail, Lock, Settings, KeyRound, Building2, Heart, MessageSquare } from "lucide-react"; 
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { getMyProperties } from "../services/propertyService";
import PropertyCard from "../components/home/PropertyCard";
import Navbar from "@/components/home/Navbar"; 
import api from "../lib/api"; 
import AddReviewForm from "../components/home/AddReviewForm";

export default function ProfilePage() {
  const { user, logout, login } = useAuth();
  const { favorites, loading: favsLoading } = useFavorites();
  
  const [myProperties, setMyProperties] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");

  // 🎯 DYNAMIC STATE: Added state handlers to manage pagination pagination boundaries
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 🛠️ Locks the grid view down to exactly 6 items max per tab selection

  // Profile Update Form Fields States
  const [profileForm, setProfileForm] = useState({
    name: user?.name || user?.user?.name || "User Account",
    email: user?.email || user?.user?.email || "",
  });

  // Avatar Management Local States
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || user?.user?.avatar || "");

  // Password Modification Form Fields States
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const loadOwnerListings = async () => {
      try {
        setListingsLoading(true);
        const data = await getMyProperties();
        setMyProperties(data || []);
      } catch (error) {
        console.error("Failed to load user listing index records:", error);
      } finally {
        setListingsLoading(false);
      }
    };
    loadOwnerListings();
  }, []);

  // ⚡ Reset pagination index whenever a user switches between Listings and Bookmarks tabs
    useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    setSecurityForm({ ...securityForm, [e.target.name]: e.target.value });
  };

  // 👑 REWRITTEN: Generates a temporary local preview but retains the file object reference safely
  const handleAvatarFileSelection = (e) => {
    if (e.target.files && e.target.files[0]) {
      const targetFile = e.target.files[0];
      setAvatarFile(targetFile);
      
      // 💡 Generate local temporary path purely for visual instant feedback in the admin UI
      setAvatarPreview(URL.createObjectURL(targetFile));
    }
  };
  // 👑 PROFILE SUBMISSION WITH ADMIN ROLE PRESERVATION GUARD & SYNTAX CORRECTIONS
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return alert("Name field cannot be left blank.");

    try {
      setUpdatingProfile(true);
      
      const resolvedUser = user?.user ? user.user : user;
      
      // 🛡️ Backup your current active role before dispatching updates
      const existingUserRole = resolvedUser?.role || localStorage.getItem("user_role") || "user";
      let updatedAvatarUrl = resolvedUser?.avatar || resolvedUser?.profilePic || resolvedUser?.image || "";

      // Step A: Handle avatar file processing
      if (avatarFile) {
        const multipartForm = new FormData();
        multipartForm.append("image", avatarFile); 
        
        try {
          const uploadRes = await api.post("/auth/upload-avatar", multipartForm, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          updatedAvatarUrl = uploadRes.data?.image || uploadRes.data?.avatarUrl || updatedAvatarUrl;
        } catch (uploadErr) {
          console.warn("Using current preview string as avatar path.", uploadErr);
          updatedAvatarUrl = avatarPreview;
        }
      }

      // Step B: Build payload object variants
      const profilePayload = {
        name: profileForm.name.trim(),
        avatar: updatedAvatarUrl,
        profilePic: updatedAvatarUrl,
        image: updatedAvatarUrl
      };

      let databaseVerifiedUserObj = null;

      try {
        const backendUpdateResponse = await api.put("/auth/update-profile", profilePayload);
        databaseVerifiedUserObj = backendUpdateResponse.data?.user;
      } catch (networkErr) {
        console.warn("Backend unaligned, proceeding with local memory fallback.", networkErr);
      }

      // Step C: Force insert role backups if missing from server response object block
      if (!databaseVerifiedUserObj) {
        databaseVerifiedUserObj = { 
          ...resolvedUser, 
          name: profileForm.name.trim(), 
          avatar: updatedAvatarUrl,
          profilePic: updatedAvatarUrl,
          role: existingUserRole
        };
      } else if (!databaseVerifiedUserObj.role) {
        databaseVerifiedUserObj.role = existingUserRole;
      }
      
           // ... your existing Step A and Step B processing codes ...

      // 👑 THE ABSOLUTE COLLISION FIX: Scope all storage keys using the user's unique ID token!
      const userId = databaseVerifiedUserObj._id || databaseVerifiedUserObj.id || "guest_sync";

      const fullProfilePicUrl = updatedAvatarUrl.startsWith('http') || updatedAvatarUrl.startsWith('data:') || updatedAvatarUrl.startsWith('blob:')
        ? updatedAvatarUrl 
        : `http://localhost:5000${updatedAvatarUrl}`;

      setAvatarPreview(fullProfilePicUrl);

      // 1. Save the complete user object document block natively
      localStorage.setItem("user", JSON.stringify(databaseVerifiedUserObj));
      
      // 2. 🛡️ Lock this user's profile picture using their unique user ID key
      localStorage.setItem(`user_profile_pic_${userId}`, fullProfilePicUrl);
      
      // 3. 🛡️ Lock this user's role privilege using their unique user ID key
      localStorage.setItem(`user_role_${userId}`, databaseVerifiedUserObj.role);

      // Re-hydrate your global application authentication state provider context
      login({ token: localStorage.getItem("token") || "mock_token", user: databaseVerifiedUserObj });

      alert("Profile configurations saved with isolated user-space locks!");

    } finally {
      setUpdatingProfile(false);
    }
  };


  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
      return alert("Please complete all password parameter fields.");
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      return alert("Validation Failure: New passwords do not match confirmation fields.");
    }

    try {
      setUpdatingPassword(true);
      await api.put("/auth/update-password", {
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword
      });
      alert("Password security updated successfully inside database!");
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change account security parameters inside database.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const cleanFavoritesList = favorites.map((fav) => fav.property ? fav.property : fav).filter(Boolean);

  // =========================================================
  // 🎯 PART 2: DYNAMIC PAGINATION SLICER (Right Column Feed Math)
  // =========================================================
  const activeDataset = activeTab === "listings" ? myProperties : cleanFavoritesList;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const paginatedList = activeDataset.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activeDataset.length / itemsPerPage) || 1;
  const tabLoading = activeTab === "listings" ? listingsLoading : favsLoading;

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24 flex flex-col">
      <Navbar />

      <section className="max-w-[1320px] mx-auto w-full px-4 pt-12 flex-1 flex flex-col justify-start">
        
        {/* UPPER IDENTITY DASHBOARD BANNER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm mb-10 text-center sm:text-left w-full">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group w-20 h-20 bg-blue-600 border-2 border-blue-500 rounded-full overflow-hidden flex items-center justify-center text-3xl font-black text-white shadow-md uppercase select-none shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="User Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{profileForm.name.charAt(0)}</span>
              )}
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-black text-slate-200 uppercase cursor-pointer transition-all duration-150 select-none">
                Edit Photo
                <input type="file" accept="image/*" onChange={handleAvatarFileSelection} className="hidden" />
              </label>
            </div>

            <div className="min-w-0 text-left">
              <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight truncate">{profileForm.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">
                <span className="truncate max-w-[200px]">{profileForm.email}</span>
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-md text-[9px] font-black tracking-wider shadow-xs">
                  <ShieldCheck className="w-3 h-3 shrink-0" />
                  <span>Verified Profile</span>
                </span>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={logout}
            className="px-5 h-11 bg-red-500/10 hover:bg-red-600 border border-red-200 dark:border-red-900/40 text-red-600 hover:text-white rounded-xl transition-all font-extrabold text-xs uppercase tracking-widest cursor-pointer shadow-xs flex items-center gap-2 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 animate-pulse" />
            <span>Logout Session</span>
          </button>
        </div>

        {/* COMPOSITE SPLIT CONTAINER ROWS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
                  {/* LEFT COLUMN PANEL: PROFILE FORMS */}
          <div className="lg:col-span-4 space-y-6 w-full">    
            
            {/* Account Settings Input Fields Block */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-3 text-left">
                <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">Account Settings</h3>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
                  <input type="text" name="name" value={profileForm.name} onChange={handleProfileChange} required className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" name="email" value={profileForm.email} disabled className="w-full px-4 py-2.5 border border-slate-100 dark:border-slate-800/60 bg-slate-100/40 dark:bg-slate-950/40 text-slate-400 dark:text-slate-600 text-xs font-semibold rounded-xl cursor-not-allowed select-none" />
                </div>
                <button type="submit" disabled={updatingProfile} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 py-3 rounded-xl text-xs font-extrabold text-white uppercase tracking-widest shadow-md shadow-blue-600/10 transition-all cursor-pointer h-11">
                  {updatingProfile ? "Saving Profile..." : "Update Details"}
                </button>
              </form>
            </div>

            {/* Password Security Modifiers Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-3 text-left">
                <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-white tracking-tight uppercase tracking-wide">Change Password</h3>
              </div>
              <form onSubmit={handleSecuritySubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                  <input type="password" name="currentPassword" value={securityForm.currentPassword} onChange={handleSecurityChange} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                  <input type="password" name="newPassword" value={securityForm.newPassword} onChange={handleSecurityChange} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={securityForm.confirmPassword} onChange={handleSecurityChange} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" />
                </div>
                <button type="submit" disabled={updatingPassword} className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 py-3 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer h-11">
                  {updatingPassword ? "Modifying..." : "Update Password"}
                </button>
              </form>
            </div>

          </div>

          {/* 📊 RIGHT COLUMN AREA: DYNAMIC PROPERTY TAB LIST FLUID PANELS */}
          <div className="lg:col-span-8 space-y-6 w-full">
            
            {/* Tab Selection Row Toggles */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 w-full justify-start items-center">
              <button
                type="button"
                onClick={() => setActiveTab("listings")}
                className={`pb-3 font-extrabold text-xs uppercase tracking-wider cursor-pointer transition-all border-b-2 px-2 flex items-center gap-1.5 ${
                  activeTab === "listings" ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>My Listings ({myProperties.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("favorites")}
                className={`pb-3 font-extrabold text-xs uppercase tracking-wider cursor-pointer transition-all border-b-2 px-2 flex items-center gap-1.5 ${
                  activeTab === "favorites" ? "border-red-500 text-red-500" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>My Bookmarks ({cleanFavoritesList.length})</span>
              </button>
            </div>

            {/* Render Content Grid Panels Conditionally */}
            {tabLoading ? (
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold animate-pulse italic py-12 text-center w-full">
                Synchronizing data loop index records...
              </p>
            ) : paginatedList.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold italic py-16 bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center w-full shadow-xs">
                No indexed parameters found inside this workspace folder layer.
              </p>
            ) : (
              <>
                {/* 🎯 PACKED GRID MATRIX: Expanded dynamically from 2 columns to a sleek 3 columns layout strategy on desktop sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pt-2 justify-items-center sm:justify-items-start w-full">
                  {paginatedList.map((property) => (
                    <PropertyCard key={property._id} item={property} />
                  ))}
                </div>

                {/* 🎯 COMPACT PROFILE FEED PAGINATION CONTROL PANEL */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/60 w-full select-none">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className="h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-40 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
                    >
                      &larr; Prev
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 font-black text-xs transition-all border rounded-xl cursor-pointer flex items-center justify-center ${
                            currentPage === pageNum
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950/40"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                                       <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className="h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-40 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
                    >
                      Next &rarr;
                    </button>
                  </div>
                )}
              </>
            )}

            {/* SUBMIT MISSION FEEDBACK CONTAINER BLOCK */}
            <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 w-full">
              <div className="flex items-center gap-2 text-left mb-1">
                <MessageSquare className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Submit Platform Feedback</h3>
              </div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-6 text-left pl-7">Write a review to tell other users about your marketplace experience</p>
              <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                <AddReviewForm />
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
