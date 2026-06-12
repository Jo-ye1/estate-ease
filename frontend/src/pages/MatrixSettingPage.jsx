import React from "react";
import Navbar from "@/components/home/Navbar";

// 👑 FIXED: Removed the extra "/admin" subfolder from the path
import AdminSettingsDashboard from "@/pages/AdminSettingsDashboard";

export default function MatrixSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200 flex flex-col">
      {/* 1. Global Platform Sticky Top Navbar Header Layout */}
      <Navbar />

      {/* 2. Isolated Content Frame Body Layout Wrapper */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="mb-6 text-left border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded uppercase">
            MASTER REGISTRY COMMAND
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white mt-1">
            Global Site Administration Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify public layout variables, document indices clauses, contact endpoints, and accordion stacks.
          </p>
        </div>

        {/* Instantiates the multi-tab layout component block built earlier */}
        <AdminSettingsDashboard />
      </main>
    </div>
  );
}
