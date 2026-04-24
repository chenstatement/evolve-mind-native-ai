import { useState } from 'react'
import { lessons } from '../data/lessons'
import { getProgress, isUnlocked } from '../utils/storage'

const lessonMeta = [
  { icon: '🧠', gradient: 'from-blue-500 to-purple-500', bg: 'bg-blue-50', text: 'text-blue-600' },
  { icon: '👁️', gradient: 'from-teal-400 to-green-500', bg: 'bg-teal-50', text: 'text-teal-600' },
  { icon: '⚡', gradient: 'from-orange-400 to-amber-500', bg: 'bg-orange-50', text: 'text-orange-600' },
  { icon: '🧩', gradient: 'from-purple-400 to-pink-500', bg: 'bg-purple-50', text: 'text-purple-600' },
  { icon: '🔍', gradient: 'from-blue-400 to-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  { icon: '🎯', gradient: 'from-red-400 to-orange-500', bg: 'bg-red-50', text: 'text-red-600' },
  { icon: '❤️', gradient: 'from-pink-400 to-rose-500', bg: 'bg-pink-50', text: 'text-pink-600' },
  { icon: '🔥', gradient: 'from-amber-400 to-red-500', bg: 'bg-amber-50', text: 'text-amber-600' },
  { icon: '🤝', gradient: 'from-green-400 to-teal-500', bg: 'bg-green-50', text: 'text-green-600' },
  { icon: '🚀', gradient: 'from-indigo-400 to-purple-500', bg: 'bg-indigo-50', text: 'text-indigo-600' },
]

export default function LessonList({ onSelect }) {
  const progress = getProgress()
  const totalScore = Object.values(progress.scores).reduce((a, b) => a + b, 0)
  const unlocked = isUnlocked()
  const [showLockMessage, setShowLockMessage] = useState(false)
  const completedCount = progress.completedLessons.length

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden bg-ink text-white pt-8 pb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-5xl mx-auto px-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-ink bg-gold px-2.5 py-1 rounded-full tracking-wide">AI NATIVE</span>
            <span className="text-xs text-white/50">思维训练</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 leading-tight">
            思维进化<br />训练营
          </h1>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            10节结构化课程，AI老师一对一引导<br />
            帮助你重塑思维习惯
          </p>

          {/* Progress Ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <circle
                  cx="32" cy="32" r="28" fill="none" stroke="#c9a96e" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(completedCount / 10) * 176} 176`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{completedCount}<span className="text-white/40">/10</span></span>
              </div>
            </div>
            <div>
              <p className="text-sm text-white/60">已完成课程</p>
              <p className="text-xl font-bold text-gold">{totalScore}<span className="text-sm text-white/40">/100分</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 pt-5 -mt-4">
        {/* Lock message */}
        {showLockMessage && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="text-sm font-medium text-amber-900">课程未解锁</p>
                <p className="text-xs text-amber-700 mt-0.5">第2-10课需要兑换码。前往「我的」页面输入兑换码解锁全部课程。</p>
              </div>
            </div>
            <button
              onClick={() => setShowLockMessage(false)}
              className="text-xs text-amber-600 mt-2 ml-8 underline"
            >
              知道了
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-lg font-bold text-gold">{completedCount}</p>
            <p className="text-[10px] text-ink-light">已完成</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-lg font-bold text-gold">{totalScore}</p>
            <p className="text-[10px] text-ink-light">总分</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-lg font-bold text-gold">{progress.streak || 0}</p>
            <p className="text-[10px] text-ink-light">连续天</p>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-bold text-ink">课程列表</h2>
          <span className="text-xs text-ink-light">{completedCount}/10 已完成</span>
        </div>

        {/* Lesson Grid */}
        <div className="grid grid-cols-2 gap-3">
          {lessons.map((lesson, idx) => {
            const meta = lessonMeta[idx]
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
                className={`relative text-left rounded-2xl p-4 border transition-all duration-300 active:scale-[0.97] overflow-hidden ${
                  isLocked
                    ? 'bg-gray-50 border-gray-100 opacity-60'
                    : isCompleted
                    ? 'bg-white border-gold/30 shadow-md'
                    : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${meta.gradient} ${isLocked ? 'opacity-20' : ''}`} />

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2 ${
                  isLocked ? 'bg-gray-100' : meta.bg
                }`}>
                  {isLocked ? '🔒' : isCompleted ? '✓' : meta.icon}
                </div>

                {/* Number badge */}
                <div className="absolute top-3 right-3">
                  {isCompleted ? (
                    <span className="text-[10px] font-bold text-gold bg-gold-bg px-1.5 py-0.5 rounded-full">{score}分</span>
                  ) : isLocked ? (
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">锁定</span>
                  ) : (
                    <span className={`text-[10px] font-medium ${meta.text} ${meta.bg} px-1.5 py-0.5 rounded-full`}>第{lesson.id}课</span>
                  )}
                </div>

                <h3 className={`text-sm font-bold leading-snug mb-1 ${isLocked ? 'text-gray-400' : 'text-ink'}`}>
                  {lesson.title}
                </h3>
                <p className={`text-[10px] leading-relaxed line-clamp-2 ${isLocked ? 'text-gray-300' : 'text-ink-light'}`}>
                  {lesson.subtitle}
                </p>

                {/* Progress bar for started but not completed */}
                {!isLocked && !isCompleted && lesson.id === (progress.currentLesson || 1) && (
                  <div className="mt-2 w-full bg-gray-100 rounded-full h-1">
                    <div className="bg-gradient-to-r from-gold to-gold-light rounded-full h-1 w-1/3 animate-pulse" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>
    </div>
  )
}
