export default function StatsCards() {
  const stats = [
    {
      title: "Properties",
      value: "125",
    },
    {
      title: "Tenants",
      value: "430",
    },
    {
      title: "Revenue",
      value: "$12,400",
    },
    {
      title: "Vacancy",
      value: "8%",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow"
        >
          <p className="text-gray-500">{stat.title}</p>
          <h2 className="text-3xl font-bold mt-2">
            {stat.value}
          </h2>
        </div>
      ))}
    </div>
  );
}