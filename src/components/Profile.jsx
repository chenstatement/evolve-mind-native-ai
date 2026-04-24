import { useState } from 'react'
import { getProgress, isUnlocked, setUnlocked, isBetaUser } from '../utils/storage'

export default function Profile({ progress, onBack, onAIConfig, onCertificate }) {
  const totalScore = Object.values(progress.scores).reduce((a, b) => a + b, 0)
  const completed = progress.completedLessons.length
  const unlocked = isUnlocked()
  const beta = isBetaUser()
  const [redeemCode, setRedeemCode] = useState('')
  const [redeemStatus, setRedeemStatus] = useState(null)

  const FEEDBACK_URL = 'https://wj.qq.com/s2/PLACEHOLDER/PLACEHOLDER'

  return (
    <div className="min-h-screen bg-cream px-5 pt-6 pb-24">
      <button onClick={onBack} className="text-ink-light text-sm mb-4 flex items-center gap-1">
        ← 返回
      </button>

      {/* Beta thank-you banner */}
      {beta && (
        <div className="bg-gold-bg rounded-xl p-3 mb-4 text-center animate-fade-in">
          <p className="text-xs text-ink-light">
            感谢参与内测！你的反馈将帮助我们做得更好。
          </p>
        </div>
      )}

      {/* Avatar */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">
          你
        </div>
        <h1 className="text-xl font-bold text-ink">学习者</h1>
        <p className="text-sm text-ink-light">加入第 {progress.streak || 1} 天</p>
        {beta && (
          <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-gold-bg rounded-full text-xs font-medium text-gold">
            🌟 种子用户
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gold">{completed}</p>
          <p className="text-xs text-ink-light">已完成</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gold">{totalScore}</p>
          <p className="text-xs text-ink-light">总分</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gold">{progress.streak || 1}</p>
          <p className="text-xs text-ink-light">连续天数</p>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl overflow-hidden mb-4">
        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
          <span className="text-sm text-ink">AI 配置</span>
          <button
            onClick={onAIConfig}
            className="text-xs text-gold px-3 py-1 border border-gold/30 rounded-lg"
          >
            配置
          </button>
        </div>
        <div className="p-4 border-b border-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-ink">课程解锁</span>
            <span className={`text-xs px-2 py-1 rounded-lg ${unlocked ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
              {unlocked ? '✓ 已解锁' : '🔒 未解锁'}
            </span>
          </div>
          {!unlocked && (
            <div className="space-y-2">
              <input
                type="text"
                value={redeemCode}
                onChange={(e) => {
                  setRedeemCode(e.target.value)
                  setRedeemStatus(null)
                }}
                placeholder="输入兑换码，如 EVOLVE-XXXXXXXX"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
              />
              <button
                onClick={() => {
                  const success = setUnlocked(redeemCode.trim())
                  setRedeemStatus(success ? 'success' : 'error')
                  if (success) window.location.reload()
                }}
                disabled={!redeemCode.trim()}
                className="w-full bg-gold text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50"
              >
                解锁全部课程
              </button>
              {redeemStatus === 'error' && (
                <p className="text-xs text-red-500">兑换码无效，请检查后重试</p>
              )}
            </div>
          )}
        </div>
        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
          <span className="text-sm text-ink">结业证书</span>
          <button
            onClick={onCertificate}
            className="text-xs text-gold px-3 py-1 border border-gold/30 rounded-lg"
          >
            查看
          </button>
        </div>
        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
          <span className="text-sm text-ink">反馈建议</span>
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gold px-3 py-1 border border-gold/30 rounded-lg inline-block"
          >
            填写问卷
          </a>
        </div>
        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
          <span className="text-sm text-ink">清除学习进度</span>
          <button
            onClick={() => {
              if (confirm('确定要清除所有学习进度吗？')) {
                localStorage.removeItem('evolve-mind-camp')
                localStorage.removeItem('beta_feedback')
                localStorage.removeItem('beta_rating_shown')
                window.location.reload()
              }
            }}
            className="text-xs text-red-500 px-3 py-1 border border-red-200 rounded-lg"
          >
            清除
          </button>
        </div>
        <div className="p-4 flex justify-between items-center">
          <span className="text-sm text-ink">关于</span>
          <span className="text-xs text-ink-light">思维进化训练营 v1.1</span>
        </div>
      </div>
    </div>
  )
}
