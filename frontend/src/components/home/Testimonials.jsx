import React from "react";

const testimonialData = [
  {
    id: 1,
    name: "John Smith",
    role: "Property Owner",
    avatar: "https://unsplash.com",
    quote: "Estate Ease made leasing my apartments a breeze! The interface is highly responsive, and I managed to secure trusted verified clients in less than a week.",
    stars: 5
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Investor & Buyer",
    avatar: "https://unsplash.com",
    quote: "The absolute best real estate tracking platform I have used this year. Local image uploads load fast, and bookmarking houses to my favorites is seamless.",
    stars: 5
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Home Owner",
    avatar: "https://unsplash.com",
    quote: "The search matching engine is incredibly accurate. I filtered by house type and location and found my dream villa instantly. Highly recommended!",
    stars: 5
  }
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 dark:bg-slate-950 border-t border-b border-slate-100 dark:border-slate-900/60 py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-500 font-bold text-xs uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">Testimonials</span>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">What Our Clients Say</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Hear directly from home owners, brokers, and investors using our local ecosystem platforms</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonialData.map((client) => (
            <div 
              key={client.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Star Rating Generation */}
                <div className="flex gap-1 text-yellow-400 text-sm mb-4">
                  {Array.from({ length: client.stars }).map((_, idx) => (
                    <span key={idx}>⭐</span>
                  ))}
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed">
                  "{client.quote}"
                </p>
              </div>

              {/* Client Profile Identity Row */}
              <div className="flex items-center gap-3 mt-6 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <img 
                  src={client.avatar} 
                  alt={client.name} 
                  className="w-10 h-10 rounded-full object-cover border border-blue-500/20"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{client.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{client.role}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
