type ReportsSummaryItemProps = {
  label: string;
  title: string;
  value: string;
};

export default function ReportsSummaryItem({
  label,
  title,
  value,
}: ReportsSummaryItemProps) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-xs font-bold text-slate-950">
          {label}
        </span>
        <span className="truncate text-xs text-slate-500">
          {title}
        </span>
      </div>

      <span className="min-w-0 max-w-[48%] truncate text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}