"use client";

import Link from "next/link";
import Button from "@/shared/ui/button";

type LoginRequiredDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
};

export default function LoginRequiredDialog({
  isOpen,
  title,
  description,
  onClose,
}: LoginRequiredDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="space-y-2">
          <p className="text-base font-bold text-slate-950">{title}</p>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="mt-5 grid gap-2">
          <Link href="/login" className="w-full">
            <Button className="w-full">로그인하고 계속하기</Button>
          </Link>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={onClose}
          >
            계속 둘러보기
          </Button>
        </div>
      </div>
    </div>
  );
}