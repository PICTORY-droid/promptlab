const TALLY_FORM_URL =
  "https://tally.so/embed/q4oNQ7?hideTitle=1&transparentBackground=1&dynamicHeight=1";

export default function TallyContactFrame() {
  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <iframe
        src={TALLY_FORM_URL}
        title="PromptLab 문의"
        className="block h-[500px] w-full sm:h-[640px]"
        loading="lazy"
      />
    </div>
  );
}