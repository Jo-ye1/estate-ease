import { useNavigate } from "react-router-dom";

const categories = [
  { id: "cat-house", title: "House", icon: "🏠", dbValue: "House" },
  { id: "cat-apartment", title: "Apartment", icon: "🏢", dbValue: "Apartment" },
  { id: "cat-villa", title: "Executive Villa", icon: "🏰", dbValue: "Villa" },
  { id: "cat-hotel", title: "Luxury Hotel", icon: "🏨", dbValue: "Hotel" },
  { id: "cat-warehouse", title: "Warehouse Space", icon: "🏭", dbValue: "Warehouse" },
];

export default function PropertyTypes() {
  const navigate = useNavigate();

  // 🛠️ Phase 2 Handler: Formulates query string routing redirect parameters on user click
  const handleCategoryClick = (typeValue) => {
    navigate(`/search?type=${typeValue}`);
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-blue-500 font-bold text-xs uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">
            Categories
          </span>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Explore Property Types
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Click a listing category to find properties matching your requirements instantly
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleCategoryClick(item.dbValue)}
              className="group bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center shadow-sm hover:shadow-md hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 select-none">
                {item.icon}
              </span>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base group-hover:text-blue-500 transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium group-hover:underline">
                Browse Collection &rarr;
              </p>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
