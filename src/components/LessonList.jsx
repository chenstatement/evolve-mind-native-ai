import { useState } from 'react'
import { lessons } from '../data/lessons'
import { getProgress, isUnlocked } from '../utils/storage'

export default function LessonList({ onSelect }) {
  const progress = getProgress()
  const totalScore = Object.values(progress.scores).reduce((a, b) => a + b, 0)
  const unlocked = isUnlocked()
  const [showLockMessage, setShowLockMessage] = useState(false)

  return (
    <div className="px-5 pt-6 pb-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gold bg-gold-bg px-2 py-0.5 rounded-full">AI NATIVE 思维训练</span>
        </div>
        <h1 className="text-2xl font-bold text-ink mb-1">思维进化训练营</h1>
        <p className="text-sm text-ink-light">10节课重塑你的大脑操作系统</p>
      </div>

      {/* Progress Card */}
      <div className="bg-ink rounded-2xl p-5 mb-6 text-white">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-white/60 text-xs mb-1">当前进度</p>
            <p className="text-2xl font-bold">{progress.completedLessons.length}/10 课</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs mb-1">累计得分</p>
            <p className="text-2xl font-bold text-gold">{totalScore}<span className="text-sm text-white/40">/100</span></p>
          </div>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gold rounded-full h-2 transition-all"
            style={{ width: `${(progress.completedLessons.length / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Lock message */}
      {showLockMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-amber-800">🔒 第2-10课需要兑换码解锁。前往「我的」页面输入兑换码。</p>
          <button
            onClick={() => setShowLockMessage(false)}
            className="text-xs text-amber-600 mt-2 underline"
          >
            知道了
          </button>
        </div>
      )}

      {/* Lesson List */}
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const isCompleted = progress.completedLessons.includes(lesson.id)
          const isLocked = lesson.id > 1 && !unlocked && !isCompleted
          const score = progress.scores[lesson.id]

          return (
            <button
              key={lesson.id}
              onClick={() => {
                if (isLocked) {
                  setShowLockMessage(true)
                } else {
                  onSelect(lesson)
                }
              }}
              className={`w-full text-left bg-white rounded-xl p-4 border transition-all ${
                isLocked
                  ? 'border-gray-100 opacity-50'
                  : isCompleted
                  ? 'border-gold/30 shadow-sm'
                  : 'border-gray-100 shadow-sm active:scale-[0.98]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  isCompleted
                    ? 'bg-gold text-white'
                    : isLocked
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gold-bg text-gold'
                }`}>
                  {isCompleted ? '✓' : isLocked ? '🔒' : lesson.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold text-sm ${isLocked ? 'text-gray-400' : 'text-ink'}`}>{lesson.title}</h3>
                    {score && (
                      <span className="text-xs bg-gold-bg text-gold px-1.5 py-0.5 rounded">{score}分</span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${isLocked ? 'text-gray-300' : 'text-ink-light'}`}>{lesson.subtitle}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
