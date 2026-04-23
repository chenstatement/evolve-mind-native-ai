import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import LessonList from './components/LessonList'
import LessonDetail from './components/LessonDetail'
import Ranking from './components/Ranking'
import Profile from './components/Profile'
import AIConfig from './components/AIConfig'
import Certificate from './components/Certificate'
import { getProgress } from './utils/storage'
import { pageView } from './utils/analytics'

function App() {
  const [view, setView] = useState('list')
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [progress, setProgress] = useState(getProgress())

  // Track page views
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

  return (
    <div className="min-h-screen bg-cream">
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50">
        <div className="max-w-[480px] mx-auto flex justify-around py-2">
          <button
            onClick={() => setView('list')}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 ${view === 'list' ? 'text-gold' : 'text-ink-dim'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <span className="text-xs">课程</span>
          </button>
          <button
            onClick={() => setView('ranking')}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 ${view === 'ranking' ? 'text-gold' : 'text-ink-dim'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
            <span className="text-xs">排名</span>
          </button>
          <button
            onClick={() => setView('profile')}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 ${view === 'profile' ? 'text-gold' : 'text-ink-dim'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="text-xs">我的</span>
          </button>
        </div>
      </nav>

      {/* Safe area for bottom nav */}
      <div className="h-16" />
      <Analytics />
    </div>
  )
}

export default App