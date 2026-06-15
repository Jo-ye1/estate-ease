import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import PropertyCard from "../components/home/PropertyCard";
import Navbar from "@/components/home/Navbar";
import { ArrowLeft, ArrowRight, Search, X, MapPin, Sliders, Layers } from "lucide-react";

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    propertyCategory: searchParams.get("propertyCategory") || "All",
    listingType: searchParams.get("listingType") || "All",
    bedrooms: searchParams.get("bedrooms") || "All",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  useEffect(() => {
    const fetchFilteredProperties = async () => {
      try {
        setLoading(true);
        const queryPayload = {};
        
        if (searchParams.get("search")) queryPayload.search = searchParams.get("search");
        if (searchParams.get("location")) queryPayload.location = searchParams.get("location");
        if (searchParams.get("propertyCategory")) queryPayload.propertyCategory = searchParams.get("propertyCategory");
        if (searchParams.get("bedrooms")) queryPayload.bedrooms = searchParams.get("bedrooms");
        if (searchParams.get("minPrice")) queryPayload.minPrice = searchParams.get("minPrice");
        if (searchParams.get("maxPrice")) queryPayload.maxPrice = searchParams.get("maxPrice");

        const dbData = await getProperties(queryPayload);
        setProperties(Array.isArray(dbData) ? dbData : []);
      } catch (error) {
        console.error("Failed loading properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProperties();
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFiltersSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key] !== "All") {
        newParams[key] = filters[key];
      }
    });
    
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      propertyCategory: "All",
      listingType: "All",
      bedrooms: "All",
      minPrice: "",
      maxPrice: "",
    });
    setSearchParams({});
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentPropertiesList = properties.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(properties.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-40">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 flex flex-col justify-between">
      
      <div className="w-full flex flex-col">
        <Navbar />

        <div className="max-w-[1320px] mx-auto px-4 pt-12 pb-4 w-full">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="text-left">
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">All Properties</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs mt-1.5 tracking-wide">
                Browse through all active real estate opportunities listed across our server pipeline ({properties.length} Matches Found)
              </p>
            </div>
          </div>

          <form 
            onSubmit={applyFiltersSubmit} 
            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 mb-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 shadow-xs w-full items-end"
          >
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 ml-1">Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text" 
                  name="search" 
                  value={filters.search} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Modern, Pool" 
                  className="w-full h-10 pl-9 pr-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 transition-all" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text" 
                  name="location" 
                  value={filters.location} 
                  onChange={handleInputChange} 
                  placeholder="e.g. New York" 
                  className="w-full h-10 pl-9 pr-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 transition-all" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 ml-1">Category</label>
              <select 
                name="propertyCategory" 
                value={filters.propertyCategory} 
                onChange={handleInputChange} 
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-bold outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="hotel">Hotel Block</option>
                <option value="office">Office Space</option>
                <option value="land">Commercial Land</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 ml-1">Operation</label>
              <select 
                name="listingType" 
                value={filters.listingType} 
                onChange={handleInputChange} 
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-bold outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">All types</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="hotel">Hotel Stays</option>
              </select>
            </div>
                        <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 ml-1">Bedrooms</label>
              <select 
                name="bedrooms" 
                value={filters.bedrooms} 
                onChange={handleInputChange} 
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-bold outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">Any Count</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4+ Beds</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 ml-1">Min Price</label>
              <input 
                type="number" 
                name="minPrice" 
                value={filters.minPrice} 
                onChange={handleInputChange} 
                placeholder="Min ($)" 
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 transition-all" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 ml-1">Max Price</label>
              <input 
                type="number" 
                name="maxPrice" 
                value={filters.maxPrice} 
                onChange={handleInputChange} 
                placeholder="Max ($)" 
                className="w-full h-10 px-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 transition-all" 
              />
            </div>

            <div className="flex gap-2 w-full col-span-2 md:col-span-1 lg:col-span-1">
              <button 
                type="submit"
                className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase text-[11px] tracking-wider rounded-xl transition-all shadow-2xs border-0 cursor-pointer flex items-center justify-center"
              >
                Filter
              </button>
              <button 
                type="button"
                onClick={clearFilters}
                className="h-10 px-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center text-xs"
              >
                Reset
              </button>
            </div>
          </form>

                    {properties.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/10 shadow-xs">
              <h2 className="text-base font-bold text-slate-400 dark:text-slate-500 mb-1">No properties found.</h2>
              <p className="text-xs text-slate-500 dark:text-slate-600">No properties match your filter selection parameters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 justify-items-center items-stretch w-full mt-8">
              {properties.map((property) => (
                <div key={property._id || property.id} className="w-full flex flex-col justify-between max-w-[312px]">
                  <PropertyCard item={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

