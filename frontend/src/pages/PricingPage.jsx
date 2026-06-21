import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import { Check, Sparkles, Building2 } from "lucide-react";
import axios from "axios";


// 🟢 PLAN HIERARCHY MAP: Defines weights to handle upward upgrade paths strictly
const TIER_WEIGHTS = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

export default function PricingPage() {

   const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [currentTierName, setCurrentTierName] = useState("Free");

  useEffect(() => {
    const fetchTiersAndStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const billingRes = await axios.get("http://localhost:5000/api/billing/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const sub = billingRes.data?.subscription;
        const activePlan = typeof sub?.plan === 'object' ? sub?.plan?.name : (sub?.plan || "Free");
        setCurrentTierName(activePlan || "Free");

        const res = await axios.get("http://localhost:5000/api/subscriptions/plans");
        setPlans(Array.isArray(res.data) ? res.data : res.data?.plans || []);
      } catch (err) {
        console.error("Failed to load pricing workspace data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTiersAndStatus();
  }, []);

  const handleCheckoutRedirect = async (planId) => {
    try {
      setProcessingId(planId);
      
      const res = await axios.post(
        "http://localhost:5000/api/billing/checkout",
        { planId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Checkout redirection failed:", err);
      alert(err.response?.data?.message || "Payment processing error.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Choose Your Workspace Scale
          </h1>
          <p className="mt-4 text-base text-slate-500 max-w-xl mx-auto">
            Upgrade your real estate tier to unlock expanded property posting caps, lead distribution models, and database telemetry features.
          </p>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/billing")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-slate-200 dark:border-slate-800 shadow-xs"
            >
              💳 View Billing & Invoices History
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const planKey = plan.name?.toLowerCase() || "free";
            const currentKey = currentTierName?.toLowerCase() || "free";

            const isEnterprise = planKey === "enterprise";
            const isPro = planKey === "pro";
            const isUserCurrentPlan = planKey === currentKey;
            
            const isTierRestricted = (TIER_WEIGHTS[planKey] ?? 0) <= (TIER_WEIGHTS[currentKey] ?? 0);

            return (
              <div
                key={plan._id}
                className={`relative bg-white dark:bg-slate-900 rounded-3xl p-8 border flex flex-col justify-between shadow-xs transition-transform ${
                  isUserCurrentPlan
                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                    : isPro 
                    ? "border-blue-500 ring-2 ring-blue-500/20 hover:-translate-y-1" 
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {isUserCurrentPlan && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                    Your Current Plan
                  </span>
                )}
                {!isUserCurrentPlan && isPro && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                    <Sparkles size={10} /> Popular Choice
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 justify-between">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    {isEnterprise && <Building2 size={18} className="text-blue-500" />}
                  </div>

                  <p className="mt-4 flex items-baseline">
                    <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="ml-1 text-xs font-semibold text-slate-400">/month</span>
                  </p>

                  <ul className="mt-8 space-y-4 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                    <li className="flex items-start gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <Check size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      Allow up to <strong>{plan.listingLimit}</strong> property listings
                    </li>
                    <li className="flex items-start gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <Check size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      Featured priority boost allocation: <strong>{plan.boostLimit}</strong>
                    </li>
                    <li className="flex items-start gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <Check size={14} className={`shrink-0 mt-0.5 ${plan.analyticsAccess ? "text-blue-500" : "text-slate-300 dark:text-slate-700"}`} />
                      <span className={plan.analyticsAccess ? "text-slate-700 dark:text-slate-300" : "line-through text-slate-400"}>
                        Real-time intelligence dashboard graphs
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <Check size={14} className={`shrink-0 mt-0.5 ${plan.prioritySupport ? "text-blue-500" : "text-slate-300 dark:text-slate-700"}`} />
                      <span className={plan.prioritySupport ? "text-slate-700 dark:text-slate-300" : "line-through text-slate-400"}>
                        24/7 dedicated account support helpdesk
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleCheckoutRedirect(plan._id)}
                    disabled={processingId !== null || isTierRestricted}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-black transition-colors ${
                      isUserCurrentPlan
                        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-not-allowed"
                        : isTierRestricted
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                        : isPro
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                        : "bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {processingId === plan._id 
                      ? "Opening Stripe gateway..." 
                      : isUserCurrentPlan 
                      ? "Current Plan Active" 
                      : isTierRestricted
                      ? "Tier Covered" 
                      : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
