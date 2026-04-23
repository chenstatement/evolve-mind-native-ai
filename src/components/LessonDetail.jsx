import { useState, useRef, useEffect } from 'react'
import AIChat from './AIChat'
import AIFeedback from './AIFeedback'
import { updateLessonScore, getProgress, getDifficulty, setEngagement, saveAIFeedback, getAIConversation } from '../utils/storage'
import { callAIFeedback } from '../utils/ai'

export default function LessonDetail({ lesson, onBack, onComplete }) {
  const [section, setSection] = useState(0)
  const [gameInput, setGameInput] = useState('')
  const [gameSubmitted, setGameSubmitted] = useState(false)
  const [homeworkInput, setHomeworkInput] = useState('')
  const [homeworkSubmitted, setHomeworkSubmitted] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [aiFeedbackData, setAiFeedbackData] = useState(null)
  const [score, setScore] = useState(0)
  const [allMessages, setAllMessages] = useState([])
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
  const scrollRef = useRef(null)

  const sections = lesson.sections || []
  const currentSection = sections[section]
  const difficulty = getDifficulty(lesson.id)

  const handleNext = () => {
    if (section < sections.length - 1) {
      setSection(section + 1)
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      calculateAndFinish()
    }
  }

  const calculateScore = (gameText, homeworkText, tasks, messages) => {
    let s = 0

    // 1. 游戏完成度 (0-3分)
    if (gameText.length > 50) s += 3
    else if (gameText.length > 20) s += 2
    else if (gameText.length > 0) s += 1

    // 2. 作业内容长度 (0-2分)
    if (homeworkText.length > 200) s += 2
    else if (homeworkText.length > 50) s += 1

    // 3. 关键词覆盖 (0-3分)
    const keywords = lesson.keywords || []
    let keywordMatches = 0
    keywords.forEach(kw => {
      if (homeworkText.includes(kw)) keywordMatches++
    })
    if (keywordMatches >= 3) s += 3
    else if (keywordMatches >= 1) s += 1

    // 4. 互动bonus (0-2分)
    if (messages.length >= 4) s += 2
    else if (messages.length >= 2) s += 1

    return Math.min(s, 10)
  }

  const calculateAndFinish = () => {
    const conversation = getAIConversation(lesson.id)
    const finalScore = calculateScore(gameInput, homeworkInput, currentSection?.tasks, conversation)
    setScore(finalScore)
    updateLessonScore(lesson.id, finalScore)

    // Save engagement and determine next lesson difficulty
    const savedMessages = getAIConversation(lesson.id)
    setEngagement(lesson.id, savedMessages)

    onComplete()
    setSection(sections.length)
  }

  const handleHomeworkSubmit = async () => {
    if (homeworkInput.length <= 10) return
    setHomeworkSubmitted(true)
    setIsLoadingFeedback(true)

    const homeworkSection = sections.find(s => s.type === 'homework')
    if (homeworkSection) {
      try {
        const feedback = await callAIFeedback(homeworkInput, homeworkSection.tasks, lesson)
        setAiFeedbackData(feedback)
        saveAIFeedback(lesson.id, feedback)
      } catch (err) {
        console.error('Feedback error:', err)
      }
    }

    setIsLoadingFeedback(false)
    setShowFeedback(true)
  }

  // Completion screen
  if (section >= sections.length) {
    return (
      <div className="min-h-screen bg-cream px-5 pt-6 pb-24">
        <button onClick={onBack} className="text-ink-light text-sm mb-4 flex items-center gap-1">
          ← 返回课程列表
        </button>
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-gold-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">第{lesson.id}课完成！</h2>
          <p className="text-ink-light mb-4">你已完成「{lesson.title}」</p>
          <div className="bg-gold-bg rounded-xl p-4 mb-4">
            <p className="text-sm text-ink-light">本课得分</p>
            <p className="text-4xl font-bold text-gold">{score}<span className="text-lg text-ink-light">/10</span></p>
          </div>
          {difficulty !== 'standard' && (
            <div className="bg-amber-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-amber-700">
                难度等级：{difficulty === 'advanced' ? '进阶' : '基础'}
              </p>
            </div>
          )}
          <button onClick={onBack} className="w-full bg-gold text-white font-semibold py-3 rounded-xl">
            继续下一课
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream" ref={scrollRef}>
      {/* Header */}
      <div className="sticky top-0 bg-cream/95 backdrop-blur-sm z-40 px-5 pt-4 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="text-ink-light">←</button>
          <div className="flex-1">
            <p className="text-xs text-gold font-medium">第{lesson.id}课 · {lesson.category}</p>
            <h1 className="text-lg font-bold text-ink">{lesson.title}</h1>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-gold rounded-full h-1.5 transition-all" style={{ width: `${((section + 1) / sections.length) * 100}%` }} />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-4 pb-24">
        {!showAI ? (
          <div className="animate-fade-in">
            {currentSection?.type === 'story' && (
              <StorySection section={currentSection} onNext={handleNext} onAI={() => setShowAI(true)} />
            )}
            {currentSection?.type === 'knowledge' && (
              <KnowledgeSection section={currentSection} onNext={handleNext} />
            )}
            {currentSection?.type === 'game' && (
              <GameSection
                section={currentSection}
                difficulty={difficulty}
                input={gameInput}
                setInput={setGameInput}
                submitted={gameSubmitted}
                setSubmitted={setGameSubmitted}
                onNext={handleNext}
              />
            )}
            {currentSection?.type === 'homework' && (
              <HomeworkSection
                section={currentSection}
                difficulty={difficulty}
                input={homeworkInput}
                setInput={setHomeworkInput}
                submitted={homeworkSubmitted}
                showFeedback={showFeedback}
                isLoadingFeedback={isLoadingFeedback}
                aiFeedback={aiFeedbackData}
                onSubmit={handleHomeworkSubmit}
                onNext={handleNext}
              />
            )}
          </div>
        ) : (
          <AIChat
            lesson={lesson}
            section={currentSection}
            onClose={() => setShowAI(false)}
            onComplete={() => { setShowAI(false); handleNext() }}
          />
        )}
      </div>
    </div>
  )
}

function StorySection({ section, onNext, onAI }) {
  return (
    <div>
      <div className="bg-white rounded-xl p-5 mb-4 shadow-sm">
        <span className="text-xs font-medium text-gold bg-gold-bg px-2 py-0.5 rounded-full">故事 · 案例</span>
        <h2 className="text-lg font-bold text-ink mt-3 mb-3">{section.title}</h2>
        <div className="text-ink-light leading-relaxed whitespace-pre-line text-sm">
          {section.content}
        </div>
      </div>
      <div className="bg-ink rounded-xl p-5 mb-4 text-white">
        <p className="text-sm text-white/70 mb-2">💡 思考题</p>
        <p className="font-medium">{section.question}</p>
      </div>
      <button onClick={onAI} className="w-full bg-gold text-white font-semibold py-3 rounded-xl mb-3">
        和AI讨论这个问题 →
      </button>
      <button onClick={onNext} className="w-full bg-white text-ink-light py-3 rounded-xl text-sm">
        跳过，继续学习
      </button>
    </div>
  )
}

function KnowledgeSection({ section, onNext }) {
  return (
    <div>
      <span className="text-xs font-medium text-gold bg-gold-bg px-2 py-0.5 rounded-full">核心知识点</span>
      <h2 className="text-lg font-bold text-ink mt-3 mb-4">{section.title}</h2>
      <div className="space-y-4">
        {section.items?.map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-ink text-sm mb-2">{item.heading}</h3>
            {item.table ? (
              <div className="space-y-2">
                {item.table.map((row, j) => (
                  <div key={j} className="flex gap-3 text-xs">
                    <span className="text-ink-light bg-gray-50 px-2 py-1 rounded flex-1">{row.left}</span>
                    <span className="text-gold bg-gold-bg px-2 py-1 rounded flex-1">{row.right}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-ink-light text-sm whitespace-pre-line">{item.text}</p>
            )}
          </div>
        ))}
      </div>
      <button onClick={onNext} className="w-full bg-gold text-white font-semibold py-3 rounded-xl mt-6">
        继续 →
      </button>
    </div>
  )
}

function GameSection({ section, difficulty, input, setInput, submitted, setSubmitted, onNext }) {
  // Get difficulty-specific content
  const diffContent = section.difficulty?.[difficulty] || section.difficulty?.standard || {
    description: section.description,
    task: section.task,
    placeholder: section.placeholder
  }

  return (
    <div>
      <span className="text-xs font-medium text-gold bg-gold-bg px-2 py-0.5 rounded-full">互动游戏</span>
      <h2 className="text-lg font-bold text-ink mt-3 mb-2">{section.title}</h2>
      <p className="text-ink-light text-sm mb-4">{diffContent.description}</p>

      {!submitted ? (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-ink mb-3">{diffContent.task}</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={diffContent.placeholder}
            className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-gold"
          />
          <button
            onClick={() => input.length > 10 && setSubmitted(true)}
            disabled={input.length <= 10}
            className="w-full bg-gold text-white font-semibold py-3 rounded-xl mt-3 disabled:opacity-50"
          >
            提交观察记录
          </button>
        </div>
      ) : (
        <div className="bg-gold-bg rounded-xl p-4 mb-4">
          <p className="text-sm text-gold font-medium mb-2">✓ 观察记录已提交</p>
          <p className="text-xs text-ink-light">{input.slice(0, 100)}...</p>
        </div>
      )}

      {submitted && (
        <button onClick={onNext} className="w-full bg-gold text-white font-semibold py-3 rounded-xl">
          继续 →
        </button>
      )}
    </div>
  )
}

function HomeworkSection({ section, difficulty, input, setInput, submitted, showFeedback, isLoadingFeedback, aiFeedback, onSubmit, onNext }) {
  // Get difficulty-specific content
  const diffContent = section.difficulty?.[difficulty] || section.difficulty?.standard || {
    tasks: section.tasks,
    prompt: section.prompt
  }

  return (
    <div>
      <span className="text-xs font-medium text-gold bg-gold-bg px-2 py-0.5 rounded-full">练习作业</span>
      <h2 className="text-lg font-bold text-ink mt-3 mb-2">{section.title}</h2>
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <ul className="space-y-2">
          {diffContent.tasks?.map((task, i) => (
            <li key={i} className="text-sm text-ink-light flex items-start gap-2">
              <span className="text-gold flex-shrink-0">{i + 1}.</span>
              {task}
            </li>
          ))}
        </ul>
      </div>

      {!submitted ? (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-ink mb-3">{diffContent.prompt}</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="写下你的观察和思考..."
            className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-gold"
          />
          <button
            onClick={onSubmit}
            disabled={input.length <= 10 || isLoadingFeedback}
            className="w-full bg-gold text-white font-semibold py-3 rounded-xl mt-3 disabled:opacity-50"
          >
            {isLoadingFeedback ? 'AI点评中...' : '提交作业'}
          </button>
        </div>
      ) : showFeedback && aiFeedback ? (
        <AIFeedback feedback={aiFeedback} onComplete={onNext} />
      ) : isLoadingFeedback ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="flex justify-center gap-1 mb-3">
            <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-sm text-ink-light">AI思维教练正在点评你的作业...</p>
        </div>
      ) : (
        <div className="bg-gold-bg rounded-xl p-4 mb-4">
          <p className="text-sm text-gold font-medium mb-2">✓ 作业已提交</p>
          <p className="text-xs text-ink-light">{input.slice(0, 100)}...</p>
          <button onClick={onNext} className="w-full bg-gold text-white font-semibold py-3 rounded-xl mt-4">
            继续 →
          </button>
        </div>
      )}
    </div>
  )
}
