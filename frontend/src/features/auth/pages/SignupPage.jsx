import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandingPanel from "../components/BrandingPanel";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import SocialLogin from "../components/SocialLogin";
import { useAuth } from "../../../context/AuthContext";
import { useFavorites } from "../../../context/FavoritesContext";
import { registerUserAPI } from "@/services/authService";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { loadFavorites } = useFavorites();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return alert("Please fill in all empty fields");
    }

    if (password !== confirmPassword) {
      return alert("Verification password does not match original entry");
    }

    try {
      setIsSubmitting(true);
      const data = await registerUserAPI({ name, email, password });
      
      login(data);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      await loadFavorites();

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration encountered an error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <BrandingPanel />

      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-slate-950 p-4">
        <AuthCard>
          <div className="text-center mb-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto text-2xl">
              🏠
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">Create Account</h1>
            <p className="text-gray-500 mt-1 text-sm">Sign up to get started</p>
          </div>

          <AuthInput
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <AuthInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <AuthButton 
            text={isSubmitting ? "Creating..." : "Sign Up"} 
            onClick={handleSignup} 
            disabled={isSubmitting}
          />

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
            <span className="text-gray-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
          </div>

          <SocialLogin />

          <div className="text-center mt-4 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
