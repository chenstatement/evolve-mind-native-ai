// Google Analytics 4 tracking utilities
const GA_ID = import.meta.env.VITE_GA_ID

export function pageView(path) {
  if (typeof gtag !== 'undefined' && GA_ID) {
    gtag('event', 'page_view', {
      page_path: path,
      page_title: getPageTitle(path),
    })
  }
}

export function event(name, params = {}) {
  if (typeof gtag !== 'undefined' && GA_ID) {
    gtag('event', name, params)
  }
}

function getPageTitle(path) {
  const titles = {
    list: '课程列表',
    lesson: '课程详情',
    ranking: '排名',
    profile: '我的',
    aiconfig: 'AI配置',
    certificate: '结业证书',
  }
  return titles[path] || path
}

// Predefined events for the app
export const AppEvents = {
  lessonStart: (lessonId) => event('lesson_start', { lesson_id: lessonId }),
  lessonComplete: (lessonId, score) => event('lesson_complete', { lesson_id: lessonId, score }),
  codeRedeem: (success) => event('code_redeem', { success: success ? 'true' : 'false' }),
  certificateView: (totalScore) => event('certificate_view', { total_score: totalScore }),
  aiChatStart: (lessonId) => event('ai_chat_start', { lesson_id: lessonId }),
  aiChatComplete: (lessonId, messageCount) => event('ai_chat_complete', { lesson_id: lessonId, message_count: messageCount }),
}
