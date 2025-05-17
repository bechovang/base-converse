import { ThemeToggle } from "@/components/theme-toggle";
import { BrainCircuit } from "lucide-react"; // Using BrainCircuit as a placeholder logo icon

export function Header() {
  return (
    <header className="py-4 px-6 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Chuyển đổi cơ số</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
