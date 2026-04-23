import { useState, useRef, useEffect } from 'react'
import { getAIConversation, saveAIConversation } from '../utils/storage'
import { callAI, getSimulatedResponse, hasAIConfig } from '../utils/ai'

export default function AIChat({ lesson, section, onClose, onComplete }) {
  const [messages, setMessages] = useState(() => {
    const saved = getAIConversation(lesson.id)
    if (saved.length > 0) return saved
    return [{
      role: 'assistant',
      content: `你好！我是你的AI思维教练。刚刚我们读了${lesson.sections?.[0]?.title || '这个故事'}，我想听听你的想法：\n\n**${section?.question || '你觉得这个故事带给你什么启发？'}**`
    }]
  })
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [useRealAI, setUseRealAI] = useState(hasAIConfig())
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    saveAIConversation(lesson.id, messages)
  }, [messages, lesson.id])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setIsTyping(true)
    setError(null)

    if (useRealAI) {
      try {
        const response = await callAI(userMsg, lesson, section, messages)
        setMessages(prev => [...prev, { role: 'assistant', content: response }])
      } catch (err) {
        if (err.message === 'NO_API_KEY') {
          setError('请先配置AI API密钥')
          setUseRealAI(false)
        } else {
          setError('AI服务暂时不可用，已切换至模拟模式')
          const fallback = getSimulatedResponse(userMsg)
          setMessages(prev => [...prev, { role: 'assistant', content: fallback }])
        }
      }
    } else {
      // Simulated AI
      setTimeout(() => {
        const response = getSimulatedResponse(userMsg)
        setMessages(prev => [...prev, { role: 'assistant', content: response }])
      }, 1200)
    }
    setIsTyping(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
            <span className="text-white text-sm">AI</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">思维教练</p>
            <p className="text-xs text-ink-light">
              {useRealAI ? 'AI私教 · 实时在线' : '模拟模式 · 可配置真实AI'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-ink-light text-sm">✕</button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-2">
          {error}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'bg-gold text-white rounded-br-md'
                : 'bg-white text-ink shadow-sm rounded-bl-md'
            }`}>
              <p className="whitespace-pre-line">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-ink-light/40 rounded-full animate-pulse-soft"/>
                <span className="w-2 h-2 bg-ink-light/40 rounded-full animate-pulse-soft" style={{ animationDelay: '0.2s' }}/>
                <span className="w-2 h-2 bg-ink-light/40 rounded-full animate-pulse-soft" style={{ animationDelay: '0.4s' }}/>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="分享你的想法..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gold text-white px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
          >
            发送
          </button>
        </div>
        <button onClick={onComplete} className="w-full text-center text-xs text-ink-light mt-2 py-1">
          结束对话，继续学习 →
        </button>
      </div>
    </div>
  )
}
