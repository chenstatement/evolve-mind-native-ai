import { useState, useEffect, useRef } from 'react'
import { lessons } from '../data/lessons'
import { setUnlocked } from '../utils/storage'

const PainPoints = [
  { icon: '🔄', title: '工作中总是重复犯错？', desc: '成长型思维帮你建立复盘习惯，从每次失败中提取进化养分' },
  { icon: '🤔', title: '做决定总是犹豫不决？', desc: '决策框架提升判断力，让你在面对复杂选择时更有底气' },
  { icon: '🤖', title: 'AI来了感到焦虑？', desc: '学会与AI协作而非竞争，把AI变成你的思维放大器' },
]

const Testimonials = [
  { name: '阿杰', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ajie', rating: 5, text: '第3课的逻辑思维训练让我在工作中做方案时思路清晰了很多，AI老师的反馈也很有启发。' },
  { name: '思思', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=sisi', rating: 5, text: '每天15分钟，10天完成。课程设计很紧凑，没有废话，每节课都有实实在在的收获。' },
  { name: '大伟', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=dawei', rating: 4, text: '原本对AI课程持怀疑态度，但体验后发现AI真的能根据我的回答给出个性化建议，超预期。' },
]

const Faqs = [
  { q: '每节课需要多长时间？', a: '每节课约15-20分钟，包含故事案例、知识讲解、互动练习和AI对话四个环节。建议每天学习1课，保持连续性。' },
  { q: '支持什么设备？', a: '任何带浏览器的设备都可以使用，手机、平板、电脑均可。推荐使用 Chrome 或 Safari 浏览器获得最佳体验。' },
  { q: '购买后可以退款吗？', a: '兑换码一经使用即解锁全部课程，不支持退款。建议在解锁前先体验第1节免费课程，确认内容符合预期。' },
  { q: '我的学习数据安全吗？', a: '所有学习数据都存储在你的设备本地，不会上传到任何服务器。你可以随时在「我的」页面清除数据。' },
  { q: 'AI对话需要额外配置吗？', a: '不需要。内置AI对话功能可直接使用。如果你想使用更强的AI模型，可以在「我的」→「AI配置」中设置自己的API Key。' },
]

const lessonMeta = [
  { icon: '🧠', color: 'bg-blue-50 text-blue-600' },
  { icon: '👁️', color: 'bg-teal-50 text-teal-600' },
  { icon: '⚡', color: 'bg-orange-50 text-orange-600' },
  { icon: '🧩', color: 'bg-purple-50 text-purple-600' },
  { icon: '🔍', color: 'bg-cyan-50 text-cyan-600' },
  { icon: '🎯', color: 'bg-red-50 text-red-600' },
  { icon: '❤️', color: 'bg-pink-50 text-pink-600' },
  { icon: '🔥', color: 'bg-amber-50 text-amber-600' },
  { icon: '🤝', color: 'bg-green-50 text-green-600' },
  { icon: '🚀', color: 'bg-indigo-50 text-indigo-600' },
]

function Typewriter({ texts, speed = 80, pause = 2000 }) {
  const [display, setDisplay] = useState('')
  const [index, setIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[index]
    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setDisplay(current.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setDeleting(true), pause)
        }
      } else {
        if (charIndex > 0) {
          setDisplay(current.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        } else {
          setDeleting(false)
          setIndex((index + 1) % texts.length)
        }
      }
    }, deleting ? speed / 2 : speed)

    return () => clearTimeout(timer)
  }, [charIndex, deleting, index, texts, speed, pause])

  return (
    <span className="inline-block min-h-[1.5em]">
      {display}
      <span className="animate-pulse-soft">|</span>
    </span>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-left"
      >
        <span className="text-sm font-medium text-ink pr-4">{q}</span>
        <span className={`text-gold flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {open && (
        <p className="text-sm text-ink-light pb-4 leading-relaxed animate-fade-in">
          {a}
        </p>
      )}
    </div>
  )
}

export default function LandingPage({ onEnterApp }) {
  const [redeemCode, setRedeemCode] = useState('')
  const [redeemStatus, setRedeemStatus] = useState(null)
  const pricingRef = useRef(null)

  const handleRedeem = () => {
    const success = setUnlocked(redeemCode.trim())
    setRedeemStatus(success ? 'success' : 'error')
    if (success) {
      setTimeout(() => window.location.reload(), 800)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative overflow-hidden bg-ink text-white px-5 pt-12 pb-16">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative text-center">
          <span className="inline-block text-xs font-bold text-ink bg-gold px-3 py-1 rounded-full tracking-wide mb-4">
            AI NATIVE 思维训练
          </span>
          <h1 className="text-3xl font-bold mb-3 leading-tight">
            思维进化训练营
          </h1>
          <p className="text-white/60 text-sm mb-6">
            AI引导式思维训练 · 10节课重塑你的思维方式
          </p>
          <div className="text-gold text-sm mb-8 h-6">
            <Typewriter
              texts={[
                '学会用AI时代的思维方式解决问题',
                '10节结构化课程，每天15分钟',
                'AI老师一对一辅导，即时反馈',
              ]}
            />
          </div>
          <button
            onClick={() => pricingRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gold text-white font-semibold px-8 py-3 rounded-xl text-sm"
          >
            立即开始学习
          </button>
        </div>
      </div>

      {/* Pain Points */}
      <div className="px-5 py-12">
        <h2 className="text-lg font-bold text-ink text-center mb-8">
          你是否也有这些困扰？
        </h2>
        <div className="space-y-4">
          {PainPoints.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <h3 className="font-semibold text-ink text-sm mb-1">{p.title}</h3>
                  <p className="text-xs text-ink-light leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Overview */}
      <div className="px-5 py-12 bg-white">
        <h2 className="text-lg font-bold text-ink text-center mb-2">
          10节结构化课程
        </h2>
        <p className="text-xs text-ink-light text-center mb-6">
          从思维底层到实践应用，系统升级你的认知
        </p>
        <div className="space-y-3">
          {lessons.map((lesson, idx) => {
            const meta = lessonMeta[idx]
            return (
              <div
                key={lesson.id}
                className="flex items-center gap-3 bg-cream rounded-xl p-3 border border-gray-50"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${meta.color}`}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gold">第{lesson.id}课</span>
                    <span className="text-[10px] text-ink-light">{lesson.duration}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-ink truncate">{lesson.title}</h3>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-5 py-12">
        <h2 className="text-lg font-bold text-ink text-center mb-8">
          内测用户怎么说
        </h2>
        <div className="space-y-4">
          {Testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full bg-gray-100" />
                <div>
                  <p className="text-sm font-medium text-ink">{t.name}</p>
                  <div className="text-gold text-xs">
                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-ink-light leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div ref={pricingRef} className="px-5 py-12 bg-ink text-white">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold mb-2">开始你的思维进化</h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-white/40 line-through text-sm">¥399</span>
            <span className="text-3xl font-bold text-gold">¥199</span>
          </div>
          <p className="text-white/60 text-xs">一次性购买，永久访问</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-5 mb-6">
          <p className="text-sm font-medium mb-3">包含内容：</p>
          <ul className="space-y-2 text-xs text-white/70">
            <li className="flex items-center gap-2">✓ 10节完整结构化课程</li>
            <li className="flex items-center gap-2">✓ AI老师一对一互动辅导</li>
            <li className="flex items-center gap-2">✓ 结业证书与成就系统</li>
            <li className="flex items-center gap-2">✓ 永久访问，免费更新</li>
            <li className="flex items-center gap-2">✓ 学习排名与连续打卡</li>
          </ul>
        </div>

        {/* Redeem */}
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-medium text-ink mb-3">已有兑换码？</p>
          <input
            type="text"
            value={redeemCode}
            onChange={(e) => {
              setRedeemCode(e.target.value)
              setRedeemStatus(null)
            }}
            placeholder="输入兑换码，如 EVOLVE-XXXXXXXX"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-ink focus:outline-none focus:border-gold mb-3"
          />
          <button
            onClick={handleRedeem}
            disabled={!redeemCode.trim()}
            className="w-full bg-gold text-white font-semibold py-3 rounded-xl disabled:opacity-50 text-sm"
          >
            解锁全部课程
          </button>
          {redeemStatus === 'error' && (
            <p className="text-xs text-red-500 mt-2">兑换码无效，请检查后重试</p>
          )}
          {redeemStatus === 'success' && (
            <p className="text-xs text-green-600 mt-2">✓ 解锁成功，正在进入...</p>
          )}
          <p className="text-[10px] text-ink-light mt-3 text-center">
            添加微信 <span className="text-gold font-medium">chenstatement</span> 购买兑换码
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-5 py-12 bg-white">
        <h2 className="text-lg font-bold text-ink text-center mb-6">
          常见问题
        </h2>
        <div className="bg-cream rounded-2xl p-4">
          {Faqs.map((faq, i) => (
            <FaqItem key={i} {...faq} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-8 text-center">
        <p className="text-xs text-ink-light mb-2">
          思维进化训练营 · AI Native 思维训练
        </p>
        <p className="text-[10px] text-ink-dim">
          版权所有 © 2026 · 备案号占位
        </p>
        <button
          onClick={onEnterApp}
          className="text-xs text-gold mt-4 underline"
        >
          直接进入课程列表（跳过落地页）→
        </button>
      </div>
    </div>
  )
}
