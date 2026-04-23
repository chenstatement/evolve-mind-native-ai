import { getProgress, getTotalScore } from '../utils/storage'

export default function Certificate({ onBack }) {
  const progress = getProgress()
  const totalScore = getTotalScore()
  const completedCount = progress.completedLessons.length
  const allCompleted = completedCount >= 10
  const completionDate = new Date().toLocaleDateString('zh-CN')

  if (!allCompleted) {
    return (
      <div className="min-h-screen bg-cream px-5 pt-6 pb-24">
        <button onClick={onBack} className="text-ink-light text-sm mb-4 flex items-center gap-1">
          ← 返回
        </button>
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-ink mb-2">结业证书</h2>
          <p className="text-ink-light mb-4">
            完成全部10节课后即可获得结业证书
          </p>
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-sm text-ink-light">当前进度</p>
            <p className="text-2xl font-bold text-gold">{completedCount}/10</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream px-5 pt-6 pb-24">
      <button onClick={onBack} className="text-ink-light text-sm mb-4 flex items-center gap-1">
        ← 返回
      </button>

      <div className="bg-white rounded-2xl p-8 text-center border-2 border-gold/20">
        {/* Certificate Header */}
        <div className="mb-6">
          <div className="text-4xl mb-3">🎓</div>
          <h1 className="text-2xl font-bold text-ink mb-1">思维进化训练营</h1>
          <p className="text-sm text-gold font-medium">结业证书</p>
        </div>

        {/* Decorative line */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gold/30"></div>
          <div className="w-2 h-2 bg-gold rounded-full"></div>
          <div className="flex-1 h-px bg-gold/30"></div>
        </div>

        {/* Certificate Body */}
        <div className="mb-6">
          <p className="text-sm text-ink-light mb-4">
            兹证明学员
          </p>
          <div className="bg-gold-bg rounded-xl p-4 mb-4">
            <p className="text-xl font-bold text-ink">学习者</p>
          </div>
          <p className="text-sm text-ink-light mb-4">
            已完成「思维进化训练营」全部10节课程的学习
          </p>
          <p className="text-sm text-ink-light">
            掌握了成长型思维、观察力、逻辑思维、认知框架、
            元认知、决策智慧、情绪智慧、实践智慧、支持系统构建
            及持续进化的核心能力
          </p>
        </div>

        {/* Score */}
        <div className="bg-ink rounded-xl p-4 mb-6 text-white">
          <p className="text-white/60 text-xs mb-1">累计得分</p>
          <p className="text-3xl font-bold text-gold">{totalScore}<span className="text-lg text-white/40">/100</span></p>
          <p className="text-white/60 text-xs mt-1">
            {totalScore >= 90 ? '卓越' : totalScore >= 70 ? '优秀' : totalScore >= 50 ? '良好' : '合格'}
          </p>
        </div>

        {/* Date */}
        <div className="mb-6">
          <p className="text-xs text-ink-light">完成日期：{completionDate}</p>
          <p className="text-xs text-ink-light mt-1">证书编号：EVOLVE-{completionDate.replace(/\//g, '')}-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
        </div>

        {/* Quote */}
        <div className="bg-gold-bg rounded-xl p-4 mb-6">
          <p className="text-sm text-ink-light italic">
            「思维进化不是终点，而是起点。<br/>
            愿你在AI时代，用进化的思维，创造美好的生活。」
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => {
              const text = `我在「思维进化训练营」完成了全部10节课程的学习，累计得分${totalScore}分！思维进化，永不止步。`
              if (navigator.share) {
                navigator.share({
                  title: '思维进化训练营结业证书',
                  text,
                  url: window.location.href
                })
              } else {
                navigator.clipboard.writeText(text)
                alert('已复制到剪贴板')
              }
            }}
            className="w-full bg-gold text-white font-semibold py-3 rounded-xl"
          >
            分享成就
          </button>
          <button onClick={onBack} className="w-full bg-white text-ink-light py-3 rounded-xl text-sm">
            返回
          </button>
        </div>
      </div>
    </div>
  )
}
