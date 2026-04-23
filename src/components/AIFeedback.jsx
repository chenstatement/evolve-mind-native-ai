export default function AIFeedback({ feedback, onComplete }) {
  if (!feedback) return null;

  return (
    <div className="space-y-4">
      {/* Overall Feedback */}
      <div className="bg-gold-bg rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
            <span className="text-white text-sm">AI</span>
          </div>
          <span className="text-sm font-semibold text-ink">思维教练点评</span>
        </div>
        <p className="text-sm text-ink-light leading-relaxed">{feedback.overall}</p>
      </div>

      {/* Item-by-item Feedback */}
      {feedback.items?.map((item, i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-2 mb-3">
            <span className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-gold">
              {i + 1}
            </span>
            <p className="text-sm font-medium text-ink">{item.task}</p>
          </div>

          <div className="space-y-2 ml-8">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-xs flex-shrink-0 mt-0.5">✓</span>
              <p className="text-sm text-green-700">{item.strength}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500 text-xs flex-shrink-0 mt-0.5">→</span>
              <p className="text-sm text-amber-700">{item.suggestion}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Continue Button */}
      <button
        onClick={onComplete}
        className="w-full bg-gold text-white font-semibold py-3 rounded-xl"
      >
        继续 →
      </button>
    </div>
  );
}
