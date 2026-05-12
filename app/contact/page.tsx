import type { Metadata } from "next";
import ContactShell from "./_components/ContactShell";

export const metadata: Metadata = {
  title: "Contact - PromptLab",
  description: "PromptLab 서비스 문의, 오류 제보, 제안 사항을 남기는 페이지입니다.",
};

export default function ContactPage() {
  return <ContactShell />;
}
