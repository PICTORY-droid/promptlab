import Link from "next/link";

const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/dashboard", label: "대시보드" },
  { href: "/write", label: "작성" },
  { href: "/safecheck", label: "SafeCheck" },
  { href: "/admin", label: "관리자" },
  { href: "/reports", label: "리포트" },
  { href: "/login", label: "로그인" },
];

export default function AppNavigation() {
  return (
    <nav aria-label="주요 메뉴" className="flex flex-wrap items-center gap-2">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
