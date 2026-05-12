import Image from "next/image";
import Link from "next/link";

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/icon-192.png"
        alt="PromptLab"
        width={40}
        height={40}
        priority
        className="h-10 w-10 rounded-2xl shadow-sm"
      />
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