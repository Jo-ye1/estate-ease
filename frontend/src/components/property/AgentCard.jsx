export default function AgentCard() {
  return (
    <div className="border rounded-2xl p-6">

      <div className="w-20 h-20 rounded-full bg-blue-500 mx-auto"></div>

      <h3 className="text-center mt-4 font-bold">
        John Agent
      </h3>

      <p className="text-center text-slate-500">
        Senior Property Consultant
      </p>

      <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl">
        Call Agent
      </button>

    </div>
  );
}