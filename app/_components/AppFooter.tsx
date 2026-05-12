import FooterLink from "./FooterLink";

export default function AppFooter() {
  return (
    <footer
      className="mt-auto py-5 text-center"
      style={{ borderTop: "1px solid #21262d" }}
    >
      <nav
        aria-label="Footer"
        className="mb-2 flex items-center justify-center gap-2 text-xs"
      >
        <FooterLink href="/privacy">개인정보 처리방침</FooterLink>
        <span className="text-slate-600">·</span>
        <FooterLink href="/contact">Contact</FooterLink>
        <span className="text-slate-600">·</span>
        <FooterLink href="/delete-account">계정 삭제</FooterLink>
      </nav>

      <p className="text-xs font-medium" style={{ color: "#a0b4c8" }}>
        © 2026 PromptLab · PICTORY-DROID
      </p>
    </footer>
  );
}