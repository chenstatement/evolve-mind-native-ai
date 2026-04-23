import { getProgress } from '../utils/storage'

export default function Ranking({ progress, onBack }) {
  const rankings = progress.rankings || []
  const myScore = Object.values(progress.scores).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-cream px-5 pt-6 pb-24">
      <button onClick={onBack} className="text-ink-light text-sm mb-4 flex items-center gap-1">
        ← 返回
      </button>

      <h1 className="text-2xl font-bold text-ink mb-1">学习排行榜</h1>
      <p className="text-sm text-ink-light mb-6">和同学们一起进步</p>

      {/* My Rank */}
      <div className="bg-ink rounded-2xl p-5 mb-6 text-white">
        <p className="text-white/60 text-xs mb-1">我的排名</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold">{rankings.findIndex(r => r.name === '你') + 1 || '-'}</p>
            <p className="text-white/60 text-sm">名</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gold">{myScore}</p>
            <p className="text-white/60 text-sm">总分</p>
          </div>
        </div>
      </div>

      {/* Rankings List */}
      <div className="space-y-2">
        {rankings.map((user, i) => (
          <div key={user.id} className={`flex items-center gap-3 bg-white rounded-xl p-3 ${user.name === '你' ? 'border border-gold/30' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              i === 0 ? 'bg-gold text-white' :
              i === 1 ? 'bg-gray-300 text-white' :
              i === 2 ? 'bg-amber-600 text-white' :
              'bg-gray-100 text-ink-light'
            }`}>
              {i + 1}
            </div>
            <img src={user.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-50" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{user.name}</p>
              <p className="text-xs text-ink-light">连续{user.streak}天学习</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gold">{user.score}</p>
            </div>
          </div>
        ))}
        {/* Add self */}
        {myScore > 0 && !rankings.some(r => r.name === '你') && (
          <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gold/30">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-100 text-ink-light flex-shrink-0">
              ?
            </div>
            <div className="w-10 h-10 rounded-full bg-gold-bg flex items-center justify-center text-gold font-bold text-sm">
              你
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">你</p>
              <p className="text-xs text-ink-light">正在学习中</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gold">{myScore}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
