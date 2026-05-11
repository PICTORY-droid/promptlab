import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type StatCardProps = {
  title: string;
  description?: string;
  value: ReactNode;
  helperText?: ReactNode;
};

export default function StatCard({
  title,
  description,
  value,
  helperText,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="p-5 sm:p-6">
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
        <div className="text-3xl font-black text-slate-950">
          {value}
        </div>

        {helperText ? (
          <div className="mt-2 text-sm leading-6 text-slate-600">
            {helperText}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
