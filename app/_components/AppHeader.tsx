import AppLogo from "./AppLogo";
import AppNavigation from "./AppNavigation";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <AppLogo />
        <AppNavigation />
      </div>
    </header>
  );
}
