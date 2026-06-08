export default function BrandingPanel() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-blue-600 text-white w-1/2 relative overflow-hidden">

      <img
        src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
        alt="house"
        className="w-[380px] h-[380px] object-cover rounded-3xl shadow-2xl"
      />

      <h1 className="text-6xl font-bold mt-12">
        Estate Ease
      </h1>

      <p className="text-2xl mt-4 opacity-90">
        Find Your Perfect Place
      </p>

      <div className="flex gap-3 mt-10">
        <span className="w-3 h-3 bg-white rounded-full"></span>
        <span className="w-3 h-3 bg-white/50 rounded-full"></span>
        <span className="w-3 h-3 bg-white/50 rounded-full"></span>
      </div>

    </div>
  );
}