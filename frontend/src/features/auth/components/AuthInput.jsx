import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange
}) {
  // 👑 STATE: Track password visibility locally inside the input component
  const [showPassword, setShowPassword] = useState(false);

  // Check if this specific input instance is meant for a password
  const isPasswordField = type === "password";

  // Calculate the live input type attribute dynamically
  const dynamicType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="space-y-2 mb-5 text-left">
      <label className="block text-sm font-medium">
        {label}
      </label>

      <div className="relative w-full">
        <input
          type={dynamicType} // 👑 FIXED: Dynamically toggles between "password" and "text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full
            py-3        
            pl-4        
            pr-12        {/* Added extra padding on the right so text doesn't overlap the eye icon */}
            rounded-xl
            border
            bg-transparent
            outline-none
            focus:ring-2
            focus:ring-blue-500
            transition-all
            ${isPasswordField && showPassword ? "font-mono tracking-wide" : ""}
          `}
        />

        {/* 👑 EYE TOGGLE BUTTON: Only renders if this input is a password field */}
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 border-0 bg-transparent cursor-pointer p-0 flex items-center justify-center outline-none z-10"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}
