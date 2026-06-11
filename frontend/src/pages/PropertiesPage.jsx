import { useEffect, useState } from "react";
import { getProperties } from "../services/propertyService";
import PropertyCard from "@/components/home/PropertyCard";
import Navbar from "@/components/home/Navbar"; 

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  useEffect(() => {
    const fetchAllPropertiesData = async () => {
      try {
        setLoading(true);
        const data = await getProperties();
        setProperties(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load platform marketplace listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPropertiesData();
  }, []);

  // CLIENT SIDE PAGINATION PIPELINE
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPropertiesList = properties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  if (loading) {
    return (
      // 🛠️ FIXED THEME OVERRIDE: Swapped static bg-slate-950 for variable theme triggers (bg-slate-50 dark:bg-slate-950)
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200">
        <Navbar />
        <div className="max-w-[1320px] mx-auto px-4 py-16">
          <h1 className="text-3xl font-black mb-8 text-slate-800 dark:text-white tracking-tight">All Properties</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((skeletonId) => (
              <div key={skeletonId} className="w-full max-w-[312px] rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/50 h-[385px] animate-pulse flex items-center justify-center text-slate-400 dark:text-slate-700 font-bold text-xs uppercase">
                Loading asset data...
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    // 🎯 FIXED THEME OVERRIDE: Container background shifts dynamically on light/dark modes
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200">
      
      <Navbar />

      <div className="max-w-[1320px] mx-auto px-4 py-16">
        
        {/* Header Block Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">All Properties</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs mt-1.5 tracking-wide">
            Browse through all active real estate opportunities listed across our server pipeline
          </p>
        </div>

        {/* EMPTY STATE FALLBACK TRACK */}
        {properties.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-900 rounded-2xl bg-white dark:bg-slate-900/10 shadow-sm">
            <h2 className="text-base font-bold text-slate-400 dark:text-slate-500 mb-1">No properties found.</h2>
            <p className="text-xs text-slate-500 dark:text-slate-600">There are currently no active listings published on the marketplace.</p>
          </div>
        ) : (
          <>
            {/* 📊 DYNAMIC 4-COLUMN COMPOSITE GRID MATRIX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 justify-items-center">
              {currentPropertiesList.map((property) => (
                // Removed the hardcoded forced '.dark' context wrapper to let card themes inherit context natively
                <div key={property._id} className="w-full max-w-[312px]">
                  <PropertyCard item={property} />
                </div>
              ))}
            </div>

            {/* DIAMOND PAGINATION INDICATORS TRACK */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = currentPage === pageNum;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`transition-all duration-300 cursor-pointer border-0 p-0 flex items-center justify-center ${
                        isCurrent 
                          ? "w-2.5 h-2.5 bg-blue-500 rotate-45" 
                          : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-800 hover:bg-slate-400 dark:hover:bg-slate-600"
                      }`}
                      style={{ borderRadius: isCurrent ? '0px' : '50%' }}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
