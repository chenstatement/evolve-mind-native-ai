import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import LessonList from './components/LessonList'
import LessonDetail from './components/LessonDetail'
import Ranking from './components/Ranking'
import Profile from './components/Profile'
import AIConfig from './components/AIConfig'
import Certificate from './components/Certificate'
import LandingPage from './components/LandingPage'
import { getProgress, isUnlocked } from './utils/storage'
import { pageView } from './utils/analytics'

function App() {
  const [view, setView] = useState('list')
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [progress, setProgress] = useState(getProgress())

  useEffect(() => {
    // Check if user is unlocked
    const unlocked = isUnlocked()
    const seenLanding = localStorage.getItem('landing_seen') === 'true'
    if (!unlocked && !seenLanding) {
      setView('landing')
    }
  }, [])

  useEffect(() => {
    pageView(view)
  }, [view])

  const refreshProgress = () => {
    setProgress(getProgress())
  }

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson)
    setView('lesson')
  }

  const handleEnterApp = () => {
    localStorage.setItem('landing_seen', 'true')
    setView('list')
  }

  const navItems = [
    { key: 'list', label: '课程', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    )},
    { key: 'ranking', label: '排名', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    )},
    { key: 'profile', label: '我的', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )},
  ]

  // Hide bottom nav on landing page
  const showNav = view !== 'landing'

  const isLanding = view === 'landing'

  return (
    <div className="min-h-screen bg-cream">
      {isLanding && (
        <LandingPage onEnterApp={handleEnterApp} />
      )}
      {!isLanding && (
        <div className="app-container">
          {view === 'list' && (
            <LessonList
              progress={progress}
              onSelect={handleLessonSelect}
            />
          )}
          {view === 'lesson' && selectedLesson && (
            <LessonDetail
              lesson={selectedLesson}
              onBack={() => setView('list')}
              onComplete={refreshProgress}
            />
          )}
          {view === 'ranking' && (
            <Ranking progress={progress} onBack={() => setView('list')} />
          )}
          {view === 'profile' && (
            <Profile progress={progress} onBack={() => setView('list')} onAIConfig={() => setView('aiconfig')} onCertificate={() => setView('certificate')} />
          )}
          {view === 'aiconfig' && (
            <AIConfig onBack={() => setView('profile')} />
          )}
          {view === 'certificate' && (
            <Certificate onBack={() => setView('profile')} />
          )}

      {/* Bottom Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 safe-area-bottom">
          <div className="max-w-[480px] mx-auto flex justify-around py-2">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className={`flex flex-col items-center gap-0.5 px-6 py-1.5 rounded-xl transition-all duration-200 ${
                  view === item.key
                    ? 'text-gold bg-gold-bg'
                    : 'text-ink-dim hover:text-ink-light'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {showNav && <div className="h-16" />}
      <Analytics />
        </div>
      )}
    </div>
  )
}

export default App
