// components/agent/ClientTimeline.tsx
import { Phone, Mail, Calendar, CheckSquare, FileText } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'call' | 'email' | 'viewing' | 'task' | 'deal';
}

const icons = {
  call: <Phone size={14} className="text-blue-500" />,
  email: <Mail size={14} className="text-purple-500" />,
  viewing: <Calendar size={14} className="text-orange-500" />,
  task: <CheckSquare size={14} className="text-amber-500" />,
  deal: <FileText size={14} className="text-green-500" />,
};

export default function ClientTimeline({ history }: { history: TimelineItem[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-w-md w-full">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Client Lifecycle Timeline</h3>
      <div className="relative border-l border-slate-800 ml-3 pl-5 space-y-5">
        {history.map((item) => (
          <div key={item.id} className="relative">
            {/* Timeline node line anchor wrapper alignment point */}
            <span className="absolute -left-[27px] top-0.5 bg-slate-800 border border-slate-700 p-1 rounded-full flex items-center justify-center">
              {icons[item.type]}
            </span>
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-100">{item.title}</span>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">{item.date}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
