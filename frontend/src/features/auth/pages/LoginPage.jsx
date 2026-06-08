import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandingPanel from "../components/BrandingPanel";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import SocialLogin from "../components/SocialLogin";
import { useAuth } from "../../../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "test@test.com" && password === "123456") {
      login({
        name: "Demo User",
        email
      });
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex">
      
      <BrandingPanel />

      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-slate-950 p-4">
        <AuthCard>
          <div className="text-center mb-4">
            <div
              className="
                w-14
                h-14
                rounded-full
                bg-blue-100
                flex
                items-center
                justify-center
                mx-auto
                text-2xl
              "
            >
              🏠
            </div>

            <h1 className="mt-3 text-2xl font-bold">
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-1 text-sm">
              Login to continue
            </p>
          </div>

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
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-between mb-5 text-sm">
            <label className="flex items-center">
              <input type="checkbox" />
              <span className="ml-2 dark:text-gray-300">
                Remember me
              </span>
            </label>

            <a
              href="#"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <AuthButton text="Login" onClick={handleLogin} />

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>

            <span className="text-gray-400 text-xs">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
          </div>

          <SocialLogin />

          <div className="text-center mt-4 text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Sign Up
            </Link>
          </div>
        </AuthCard>
      </div>

    </div>
  );
}
