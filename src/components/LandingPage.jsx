import { useState, useEffect, useRef } from 'react'
import { lessons } from '../data/lessons'
import { setUnlocked } from '../utils/storage'

const PainPoints = [
  {
    icon: '🔄',
    title: '重复犯错，原地打转',
    desc: '同样的错误犯了又犯，却不知道问题出在哪。成长型思维帮你建立复盘习惯，把每次失败变成进化养分。',
  },
  {
    icon: '🤔',
    title: '决策犹豫，错失良机',
    desc: '面对选择总是纠结，怕选错、怕后悔。系统化的决策框架让你在面对复杂局面时更有底气。',
  },
  {
    icon: '🤖',
    title: 'AI来了，感到焦虑',
    desc: '担心被AI取代，不知道未来在哪。学会与AI协作而非竞争，把AI变成你的思维放大器。',
  },
]

const Audience = [
  { icon: '💼', text: '25-45岁职场人' },
  { icon: '📈', text: '想提升思维质量的管理者' },
  { icon: '🎯', text: '希望用AI提升效率的从业者' },
  { icon: '🌱', text: '追求个人成长的终身学习者' },
]

const Testimonials = [
  {
    name: '阿杰',
    role: '产品经理',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ajie',
    rating: 5,
    text: '第3课的逻辑思维训练让我在做产品方案时思路清晰了很多。以前写PRD总是东一句西一句，现在会先搭框架再填充。',
  },
  {
    name: '思思',
    role: '市场运营',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=sisi',
    rating: 5,
    text: '每天15分钟，10天完成。课程设计很紧凑，没有废话，每节课都有实实在在的收获。AI老师的反馈经常让我有「原来还能这样想」的惊喜。',
  },
  {
    name: '大伟',
    role: '技术总监',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=dawei',
    rating: 5,
    text: '原本对这类课程持怀疑态度，但体验后发现内容确实扎实。特别是AI对话环节，能根据我的实际工作场景给出针对性建议。',
  },
]

const Faqs = [
  {
    q: '完全没有AI基础，能学会吗？',
    a: '完全可以。课程不需要你有任何技术背景，我们教的是「用AI的思维方式」，而不是编程或技术细节。',
  },
  {
    q: '每节课需要多长时间？',
    a: '每节课约15-20分钟，包含故事案例、知识讲解、互动练习和AI对话四个环节。建议每天学习1课，10天完成。',
  },
  {
    q: '手机、电脑都能学吗？',
    a: '任何带浏览器的设备都可以。手机、平板、电脑均可，进度会自动保存在当前设备上。',
  },
  {
    q: '购买后可以退款吗？',
    a: '兑换码一经使用即解锁全部课程，不支持退款。建议先体验第1节免费课程，确认内容符合预期后再购买。',
  },
  {
    q: 'AI对话需要额外付费吗？',
    a: '不需要。内置AI对话功能可直接使用。如果你想使用更强的AI模型，可以在设置中配置自己的API Key。',
  },
]

const lessonMeta = [
  { icon: '🧠', title: '成长型思维', duration: '15分钟' },
  { icon: '👁️', title: '观察力训练', duration: '15分钟' },
  { icon: '⚡', title: '逻辑思维', duration: '20分钟' },
  { icon: '🧩', title: '认知框架', duration: '20分钟' },
  { icon: '🔍', title: '元认知', duration: '20分钟' },
  { icon: '🎯', title: '决策智慧', duration: '20分钟' },
  { icon: '❤️', title: '情绪智慧', duration: '15分钟' },
  { icon: '🔥', title: '实践智慧', duration: '20分钟' },
  { icon: '🤝', title: '支持系统', duration: '15分钟' },
  { icon: '🚀', title: '持续进化', duration: '20分钟' },
]

function Typewriter({ texts, speed = 60, pause = 2000 }) {
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
    <span className="inline-block">
      {display}
      <span className="animate-pulse-soft">|</span>
    </span>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left group"
      >
        <span className="text-base font-medium text-white pr-4">{q}</span>
        <span
          className={`text-gold flex-shrink-0 transition-transform duration-300 text-lg ${open ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>
      {open && (
        <p className="text-sm text-white/60 pb-5 leading-relaxed animate-fade-in">
          {a}
        </p>
      )}
    </div>
  )
}

function ScrollReveal({ children, className = '' }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
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

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-ink text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/3 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold text-ink bg-gold px-4 py-1.5 rounded-full tracking-wider mb-6">
              AI NATIVE 思维训练
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              思维进化训练营
            </h1>
            <p className="text-lg md:text-xl text-white/50 mb-4 leading-relaxed">
              10节结构化课程，AI老师一对一引导
              <br className="hidden md:block" />
              每天15分钟，重塑你的思维方式
            </p>
            <div className="text-gold text-base md:text-lg mb-10 h-8">
              <Typewriter
                texts={[
                  '学会用AI时代的思维方式解决问题',
                  '从「被动接受」到「主动进化」',
                  '10天，建立受益终身的思维习惯',
                ]}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToPricing}
                className="bg-gold text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-gold-light transition-colors"
              >
                立即开始学习
              </button>
              <button
                onClick={onEnterApp}
                className="text-white/60 hover:text-white font-medium px-8 py-4 rounded-xl text-base transition-colors"
              >
                先免费体验第1课 →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gold">10</p>
              <p className="text-sm text-ink-light mt-1">节结构化课程</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gold">15</p>
              <p className="text-sm text-ink-light mt-1">分钟/每天</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gold">AI</p>
              <p className="text-sm text-ink-light mt-1">一对一辅导</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-gold">199</p>
              <p className="text-sm text-ink-light mt-1">元 一次购买</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PAIN POINTS ===== */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              你是否也有这些困扰？
            </h2>
            <p className="text-lg text-ink-light max-w-2xl mx-auto">
              这些问题看似无关，本质上都是思维方式需要升级的信号
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {PainPoints.map((p, i) => (
            <ScrollReveal key={i} className={i === 1 ? 'md:mt-8' : ''}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-ink rounded-2xl flex items-center justify-center text-2xl mb-6">
                  {p.icon}
                </div>
                <h3 className="text-xl font-bold text-ink mb-3">{p.title}</h3>
                <p className="text-ink-light leading-relaxed">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== AUDIENCE ===== */}
      <section className="bg-ink text-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">这门课适合谁</h2>
              <p className="text-lg text-white/50">如果你符合以下任意一条，这门课就是为你准备的</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Audience.map((a, i) => (
              <ScrollReveal key={i}>
                <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="text-3xl mb-3">{a.icon}</div>
                  <p className="text-sm font-medium">{a.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COURSE OUTLINE ===== */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              10天，系统升级你的思维
            </h2>
            <p className="text-lg text-ink-light">不是零散的技巧，而是一套完整的思维进化体系</p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessonMeta.map((lesson, i) => (
            <ScrollReveal key={i}>
              <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{lesson.icon}</span>
                  <div>
                    <span className="text-xs text-gold font-medium">第{i + 1}天</span>
                    <h3 className="font-semibold text-ink">{lesson.title}</h3>
                  </div>
                </div>
                <p className="text-xs text-ink-light">{lesson.duration}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-cream-dark py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
                他们这样说
              </h2>
              <p className="text-lg text-ink-light">来自内测学员的真实反馈</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {Testimonials.map((t, i) => (
              <ScrollReveal key={i} className={i === 1 ? 'md:mt-6' : ''}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full bg-gray-100"
                    />
                    <div>
                      <p className="font-semibold text-ink">{t.name}</p>
                      <p className="text-xs text-ink-light">{t.role}</p>
                    </div>
                  </div>
                  <div className="text-gold text-sm mb-3">
                    {'★'.repeat(t.rating)}
                  </div>
                  <p className="text-sm text-ink-light leading-relaxed">{t.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section ref={pricingRef} className="bg-ink text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">开始你的思维进化</h2>
            <p className="text-white/50 mb-10">一次购买，永久访问，持续更新</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="bg-white/5 backdrop-blur rounded-3xl p-8 md:p-12 border border-white/10 mb-10">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-white/30 line-through text-xl">¥399</span>
                <span className="text-5xl md:text-6xl font-bold text-gold">¥199</span>
              </div>
              <p className="text-white/40 text-sm mb-8">限时优惠价格</p>

              <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
                {[
                  '10节完整结构化课程',
                  'AI老师一对一互动辅导',
                  '结业证书与成就系统',
                  '永久访问，免费更新',
                  '学习排名与连续打卡',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70">
                    <span className="text-gold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="bg-white rounded-2xl p-6">
                <p className="text-sm font-medium text-ink mb-3">已有兑换码？直接解锁</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={redeemCode}
                    onChange={(e) => {
                      setRedeemCode(e.target.value)
                      setRedeemStatus(null)
                    }}
                    placeholder="输入兑换码"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-ink focus:outline-none focus:border-gold"
                  />
                  <button
                    onClick={handleRedeem}
                    disabled={!redeemCode.trim()}
                    className="bg-gold text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50"
                  >
                    解锁
                  </button>
                </div>
                {redeemStatus === 'error' && (
                  <p className="text-xs text-red-500 mt-2">兑换码无效，请检查后重试</p>
                )}
                {redeemStatus === 'success' && (
                  <p className="text-xs text-green-600 mt-2">✓ 解锁成功，正在进入...</p>
                )}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <p className="text-white/40 text-sm">
              添加微信 <span className="text-gold font-medium">chenstatement</span> 购买兑换码
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">常见问题</h2>
          </div>
        </ScrollReveal>

        <div className="bg-ink rounded-2xl p-6 md:p-8">
          {Faqs.map((faq, i) => (
            <FaqItem key={i} {...faq} />
          ))}
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="bg-cream-dark py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-4">
            准备好升级你的思维方式了吗？
          </h2>
          <p className="text-ink-light mb-8">10天，每天15分钟，建立受益终身的思维习惯</p>
          <button
            onClick={scrollToPricing}
            className="bg-gold text-white font-semibold px-10 py-4 rounded-xl text-lg hover:bg-gold-light transition-colors"
          >
            立即开始学习
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-ink text-white/30 py-8 text-center text-sm">
        <p>思维进化训练营 · AI Native 思维训练</p>
        <p className="mt-1">© 2026 版权所有</p>
      </footer>
    </div>
  )
}
