"use client";

export type PromptFormStep = "core" | "optional" | "publish";

const steps: Array<{
  key: PromptFormStep;
  label: string;
}> = [
  { key: "core", label: "작성" },
  { key: "optional", label: "옵션" },
  { key: "publish", label: "저장" },
];

type PromptFormStepTabsProps = {
  currentStep: PromptFormStep;
  onStepChange: (step: PromptFormStep) => void;
};

export default function PromptFormStepTabs({
  currentStep,
  onStepChange,
}: PromptFormStepTabsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {steps.map((step) => {
        const isActive = step.key === currentStep;

        return (
          <button
            key={step.key}
            type="button"
            className={
              isActive
                ? "rounded-full bg-slate-950 px-3 py-2 text-sm font-bold text-white"
                : "rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600"
            }
            onClick={() => onStepChange(step.key)}
          >
            {step.label}
          </button>
        );
      })}
    </div>
  );
}