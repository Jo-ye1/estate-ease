import React, { useState } from 'react';
import { Home, Share2, Info, BookOpen, Mail, FileText, HelpCircle, HelpCircle as WorkflowIcon } from "lucide-react"; 

import HomeManager from "./HomeManager";
import AboutManager from './AboutManager';
import BlogManager from './BlogManager';
import ContactManager from './ContactManager';
import TermsManager from './TermsManager';
import FaqManager from './FaqManager';
import SocialsManager from './SocialsManager'; 
import WorkflowManager from './WorkflowManager'; // 🟢 1. IMPORTED YOUR NEW WORKFLOW MANAGER NODE

export default function AdminSettingsDashboard() {
  const [activeTab, setActiveTab] = useState('about');

  // --- Configuration Navigation Map Schema Matrix ---
  const navigationItems = [
    { id: 'home_cms', label: 'HOME PAGE CMS', icon: Home },
    { id: 'about', label: 'About Page', icon: Info },
    
    // 🟢 2. MOUNTED DYNAMIC MODULE TAB ENTRY POINT FOR THE WORKFLOW SECTION RIGHT HERE
    { id: 'workflow', label: 'How It Works (Engine)', icon: WorkflowIcon },
    
    { id: 'blog', label: 'Blog Journal', icon: BookOpen },
    { id: 'contact', label: 'Contact Settings', icon: Mail },
    { id: 'socials', label: 'Socials & Footer', icon: Share2 },
    { id: 'terms', label: 'Terms & Privacy', icon: FileText },
    { id: 'faq', label: 'FAQ Accordions', icon: HelpCircle },
  ];

  return (
    <div className="w-full text-slate-900 dark:text-gray-100 transition-colors duration-200">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Structural Left Navigation Tab Sidebar List */}
        <aside className="w-full lg:w-56 shrink-0 p-4 bg-white/40 dark:bg-[#0a101d]/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl">
          <p className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-3 text-left pl-2">
            MANAGEMENT MODULES
          </p>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-0 cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* 🟢 3. CONDITIONAL MAIN DISPLAY RENDERING MANAGER PIPELINE */}
        <main className="flex-1 w-full min-w-0">
          {activeTab === 'home_cms' && <HomeManager />}
          {activeTab === 'about' && <AboutManager />}
          {activeTab === 'workflow' && <WorkflowManager />} 
          {activeTab === 'blog' && <BlogManager />}
          {activeTab === 'contact' && <ContactManager />}
          {activeTab === 'socials' && <SocialsManager />} 
          {activeTab === 'terms' && <TermsManager />}
          {activeTab === 'faq' && <FaqManager />}
        </main>
        
      </div>
    </div>
  );
}
