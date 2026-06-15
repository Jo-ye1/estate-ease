import React from "react";
import { signInWithPopup } from "firebase/auth"; 
import { auth, googleProvider } from "@/config/fireBase"; 
import { useAuth } from "../../../context/AuthContext"; 
import { useNavigate } from "react-router-dom";

export default function SocialLogin({ theme }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      console.log("Launching secure Firebase Google Login Popup...");
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      console.log("Firebase authorized user successfully:", firebaseUser.email);

      const res = await fetch("http://localhost:5000/api/auth/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL
        })
      });

      const data = await res.json();

      // 👑 SUCCESS BLOCK FIXED: Let AuthContext handle localStorage single-handedly
      if (res.ok && data.token) {
        console.log("Backend synchronization successful! Triggering global auth login...");
        
        // Hydrate global authentication hook states (this reads and sets storage internally)
        login(data); 

        // Dynamically route depending on profile setup completion status
        if (data.isNewUser) {
          console.log("New user registered! Redirecting to onboarding step...");
          navigate("/welcome-setup"); 
        } else {
          console.log("Existing user recognized. Navigating home...");
          navigate("/"); 
        }
      } else {
        alert(data.message || "Failed to process Google account synchronization with database.");
      }
    } catch (err) {
      console.error("Google authentication error details:", err);
      if (err.code === "auth/cancelled-popup-request" || err.message?.includes("cancelled-popup-request")) {
        return; 
      }
      alert(`Google popup communication dropped: ${err.message || err}`);
    }
  };

  const handleFacebookClick = () => {
    alert("Facebook registration configurations require a custom App Secret from developer panels. Let's get Google testing perfectly first!");
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-3 w-full">
        <button
          type="button" 
          onClick={handleGoogleClick}
          className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
        >
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={handleFacebookClick}
          className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
        >
          <span>Facebook</span>
        </button>
      </div>
    </div>
  );
}
