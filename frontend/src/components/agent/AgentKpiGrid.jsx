export default function AgentKpiGrid({ dashboard }) {
  const cards = [
    { label: "Assigned Leads", value: dashboard.leadsCount },
    { label: "Closed Deals", value: dashboard.closedDeals },
    { label: "Pending Tasks", value: dashboard.tasksPending },
    { label: "Overdue Tasks", value: dashboard.tasksOverdue },
    { label: "Properties", value: dashboard.propertiesAssigned },
    { label: "Revenue", value: `$${dashboard.totalRevenueGenerated}` },
    { label: "Conversion Rate", value: `${dashboard.conversionRate}%` },
    { label: "Workload", value: dashboard.currentWorkload }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-4 pt-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border">
          <p className="text-xs text-slate-400">{card.label}</p>
          <h3 className="text-xl font-black">{card.value}</h3>
        </div>
      ))}
    </div>
  );
}