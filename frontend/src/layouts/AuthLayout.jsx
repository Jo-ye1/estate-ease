import { ThemeToggle } from "@/components/ui/ThemeToggle";

function AuthLayout({ leftSide, rightSide }) {
  return (
    <div className="flex h-screen">
      <div className="w-1/2">
        {leftSide}
      </div>

      <div className="w-1/2 flex items-center justify-center bg-gray-100 dark:bg-slate-950">
        {rightSide}
      </div>
    </div>
  );
}

export default AuthLayout;
