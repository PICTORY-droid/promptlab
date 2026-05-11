import Link from "next/link";

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
        PL
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-black tracking-tight text-slate-950">
          PromptLab
        </span>
        <span className="block text-xs font-medium text-slate-500">
          AI SafeCheck inside
        </span>
      </span>
    </Link>
  );
}
