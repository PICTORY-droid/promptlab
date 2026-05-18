const TALLY_FORM_URL =
  "https://tally.so/embed/q4oNQ7?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

export default function TallyContactFrame() {
  return (
    <section aria-label="PromptLab 문의 양식" className="space-y-2">
      <p className="text-sm font-semibold text-slate-800">
        문의 양식
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <iframe
          src={TALLY_FORM_URL}
          title="PromptLab 문의"
          className="h-[560px] w-full sm:h-[680px]"
          loading="lazy"
        />
      </div>
    </section>
  );
}