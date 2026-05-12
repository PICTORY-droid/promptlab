import Link from "next/link";

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="text-xs font-medium text-slate-400 transition hover:text-slate-200"
    >
      {children}
    </Link>
  );
}
