const SUGGESTIONS = [
  "How am I doing on my budgets this month?",
  "When will my savings pots be ready?",
  "Show me my biggest expenses this week",
  "Am I overspending anywhere?",
];

export const EmptyState = ({ onSuggestionClick }) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-6">
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="size-12 rounded-full bg-grey-100 flex items-center justify-center text-xl">
        ✦
      </div>
      <h3 className="text-lg font-bold text-foreground">
        What do you want to know?
      </h3>
      <p className="text-sm text-grey-500 max-w-sm">
        Ask me anything about your finances — budgets, pots, spending patterns,
        or forecasts.
      </p>
    </div>
    <div className="grid grid-cols-2 gap-2 w-full">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          onClick={() => onSuggestionClick(s)}
          className="text-left text-sm text-grey-500 border border-grey-100 rounded-xl px-4 py-3 hover:border-grey-300 hover:text-foreground transition-colors bg-white"
        >
          {s}
        </button>
      ))}
    </div>
  </div>
);
