import { Link } from "react-router-dom";
import BrandingPanel from "../components/BrandingPanel";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import SocialLogin from "../components/SocialLogin";

export default function SignupPage() {
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
              Create Account
            </h1>

            <p className="text-gray-500 mt-1 text-sm">
              Sign up to get started
            </p>
          </div>

          <AuthInput
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
          />

          <AuthInput
            label="Email"
            type="email"
            placeholder="Enter your email"
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="Create password"
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
          />

          <AuthButton text="Sign Up" />

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>

            <span className="text-gray-400 text-xs">
              OR
            </span>

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
