import { ThemeToggle } from "@/components/ui/ThemeToggle";

function AuthCard({ children }) {
  return (
    <div className="
      w-full
      max-w-sm
      bg-white
      dark:bg-slate-900
      rounded-3xl
      shadow-xl
      p-6
    ">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
        <ThemeToggle />
      </div>
        
      {children}
    </div>
  );
}

export default AuthCard;
