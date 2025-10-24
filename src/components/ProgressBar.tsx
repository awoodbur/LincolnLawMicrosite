export function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-wood-dark font-medium mb-2">
        <span>Step {step} of {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="w-full h-2 bg-wood-light/30 rounded-full overflow-hidden">
        <div
          className="h-2 bg-forest-dark rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
