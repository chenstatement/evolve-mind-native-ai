// 内测数据导出脚本
// 用法：在应用页面（chenshushi.com）的浏览器控制台中粘贴此脚本内容，按回车执行
// 脚本会自动读取 localStorage 中的学习数据，生成汇总报告并下载为 JSON 文件

function exportBetaData() {
  const raw = localStorage.getItem('evolve-mind-camp')
  if (!raw) {
    console.log('未找到学习数据')
    return
  }

  const data = JSON.parse(raw)

  // 生成汇总
  const report = {
    exportTime: new Date().toISOString(),
    isBetaUser: (data.redeem_code || '').toUpperCase().startsWith('BETA-'),
    completedLessons: data.completedLessons?.length || 0,
    totalScore: Object.values(data.scores || {}).reduce((a, b) => a + b, 0),
    streak: data.streak || 0,
    scoresByLesson: data.scores || {},
    aiConversationsCount: Object.keys(data.aiConversations || {}).length,
    difficultySettings: data.difficulty || {},
    betaFeedback: null
  }

  // 尝试读取 beta feedback
  try {
    report.betaFeedback = JSON.parse(localStorage.getItem('beta_feedback') || 'null')
  } catch {}

  // 输出 JSON 到控制台
  console.log('=== 学习数据导出 ===')
  console.log(JSON.stringify(data, null, 2))

  // 输出可读报告
  console.log('\n=== 汇总报告 ===')
  console.log(`完成课程: ${report.completedLessons}/10`)
  console.log(`累计得分: ${report.totalScore}/100`)
  console.log(`连续天数: ${report.streak}`)
  console.log(`是否内测用户: ${report.isBetaUser ? '是' : '否'}`)
  console.log(`AI 互动课程数: ${report.aiConversationsCount}`)

  if (report.betaFeedback) {
    console.log(`\n内测反馈:`)
    console.log(`  评分: ${report.betaFeedback.rating}/5`)
    console.log(`  最喜欢: ${report.betaFeedback.favorite || '未填写'}`)
    console.log(`  需改进: ${report.betaFeedback.improve || '未填写'}`)
    console.log(`  提交时间: ${new Date(report.betaFeedback.timestamp).toLocaleString('zh-CN')}`)
  }

  // 复制到剪贴板（如果支持）
  try {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
    console.log('\n✓ 汇总报告已复制到剪贴板')
  } catch (e) {
    // 忽略剪贴板错误
  }

  // 下载 JSON 文件
  const exportBlob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(exportBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = `evolve-beta-report-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)

  console.log('\n✓ 报告已下载到本地')
  return report
}

exportBetaData()
