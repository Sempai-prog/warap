export function StepIndicator({ step }: { step: number }) {
  const steps = ["Identité", "Design", "Business"];
  return (
    <div className="relative flex justify-between mb-8 w-full max-w-md mx-auto">
      {/* Connector Line */}
      <div className="absolute top-5 left-0 w-full h-0.5 bg-neutral-100 -z-10 transform -translate-y-1/2" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-primary-600 -z-10 transform -translate-y-1/2 transition-all duration-300"
        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = step >= stepNum;
        const isCurrent = step === stepNum;

        return (
          <div key={index} className="flex flex-col items-center bg-white dark:bg-neutral-950 px-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                isActive
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "bg-white border-neutral-200 text-neutral-400"
              } ${isCurrent ? "ring-4 ring-primary-100 dark:ring-primary-900/30" : ""}`}
            >
              {stepNum}
            </div>
            <span
              className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                isActive ? "text-primary-700 dark:text-primary-400" : "text-neutral-400"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
