import {
  LayoutDashboard,
  Building2,
  PlusSquare,
  Users,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Properties", icon: Building2 },
  { name: "Add Property", icon: PlusSquare },
  { name: "Tenants", icon: Users },
  { name: "Payments", icon: CreditCard },
  { name: "Reports", icon: BarChart3 },
  { name: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">
          Estate Ease
        </h1>
      </div>

      <nav className="space-y-2 px-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <item.icon size={20} />
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}