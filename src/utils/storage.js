const STORAGE_KEY = 'evolve-mind-camp';

// 兑换码字符表（去掉易混淆的 0,O,1,I,L）
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // 32个字符
const CODE_PREFIX = 'EVOLVE-';

// 验证兑换码格式和校验位
function verifyRedeemCode(code) {
  const normalized = code.trim().toUpperCase();
  if (!normalized.startsWith(CODE_PREFIX)) return false;

  const body = normalized.slice(CODE_PREFIX.length);
  if (body.length !== 8) return false;

  // 检查每个字符是否在合法字符表中
  for (const ch of body) {
    if (!CODE_CHARS.includes(ch)) return false;
  }

  // 校验位验证：前7位字符索引之和 % 32 == 第8位字符的索引
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += CODE_CHARS.indexOf(body[i]);
  }
  const checksum = sum % 32;
  return checksum === CODE_CHARS.indexOf(body[7]);
}

// 批量生成有效兑换码（用于运营端生成）
export function generateRedeemCodes(count = 100) {
  const codes = [];
  const seen = new Set();

  while (codes.length < count) {
    // 生成7位随机字符
    let body = '';
    for (let i = 0; i < 7; i++) {
      body += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }

    // 计算校验位
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      sum += CODE_CHARS.indexOf(body[i]);
    }
    const checksum = CODE_CHARS[sum % 32];
    const fullCode = CODE_PREFIX + body + checksum;

    if (!seen.has(fullCode)) {
      seen.add(fullCode);
      codes.push(fullCode);
    }
  }

  return codes;
}

export function getProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultProgress();
    const parsed = JSON.parse(data);
    // Migrate old data to new structure
    if (parsed.unlocked === undefined) parsed.unlocked = false;
    if (!parsed.difficulty) parsed.difficulty = {};
    if (!parsed.aiFeedback) parsed.aiFeedback = {};
    if (!parsed.engagement) parsed.engagement = {};
    return parsed;
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function defaultProgress() {
  return {
    currentLesson: 1,
    completedLessons: [],
    scores: {},
    rankings: generateDemoRankings(),
    streak: 0,
    lastStudyDate: null,
    aiConversations: {},
    unlocked: false,
    difficulty: {},
    aiFeedback: {},
    engagement: {}
  };
}

function generateDemoRankings() {
  const names = ['小明', '阿杰', '思思', '大伟', '雨桐', '浩然', '静怡', '子轩'];
  return names.map((name, i) => ({
    id: i,
    name,
    avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}`,
    score: Math.floor(Math.random() * 40) + 20,
    streak: Math.floor(Math.random() * 15) + 1
  })).sort((a, b) => b.score - a.score);
}

export function updateLessonScore(lessonId, score) {
  const progress = getProgress();
  progress.scores[lessonId] = score;
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  progress.currentLesson = Math.max(progress.currentLesson, lessonId + 1);
  saveProgress(progress);
  return progress;
}

export function saveAIConversation(lessonId, messages) {
  const progress = getProgress();
  progress.aiConversations[lessonId] = messages;
  saveProgress(progress);
}

export function getAIConversation(lessonId) {
  const progress = getProgress();
  return progress.aiConversations[lessonId] || [];
}

export function getTotalScore() {
  const progress = getProgress();
  return Object.values(progress.scores).reduce((a, b) => a + b, 0);
}

// === Unlock System ===

export function isUnlocked() {
  return getProgress().unlocked;
}

export function setUnlocked(code) {
  if (!verifyRedeemCode(code)) return false;
  const progress = getProgress();
  progress.unlocked = true;
  progress.redeem_code = code.trim();
  saveProgress(progress);
  return true;
}

// === Beta Feedback System ===

export function getBetaFeedback() {
  try {
    return JSON.parse(localStorage.getItem('beta_feedback') || 'null');
  } catch {
    return null;
  }
}

export function setBetaFeedback(data) {
  localStorage.setItem('beta_feedback', JSON.stringify({
    ...data,
    timestamp: Date.now()
  }));
}

export function isBetaUser() {
  const progress = getProgress();
  const code = progress.redeem_code || '';
  return code.toUpperCase().startsWith('BETA-');
}

// === Difficulty System ===

export function getDifficulty(lessonId) {
  const progress = getProgress();
  return progress.difficulty[lessonId] || 'standard';
}

export function setDifficulty(lessonId, level) {
  const progress = getProgress();
  progress.difficulty[lessonId] = level;
  saveProgress(progress);
}

export function calculateEngagement(messages) {
  const userMessages = messages.filter(m => m.role === 'user');
  const messageCount = userMessages.length;
  const avgLength = userMessages.length > 0
    ? userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length
    : 0;
  return { messageCount, avgResponseLength: Math.round(avgLength) };
}

export function determineDifficulty(engagement) {
  if (engagement.messageCount >= 3 && engagement.avgResponseLength >= 30) return 'advanced';
  if (engagement.messageCount >= 2 && engagement.avgResponseLength >= 15) return 'standard';
  return 'basic';
}

export function setEngagement(lessonId, messages) {
  const engagement = calculateEngagement(messages);
  const progress = getProgress();
  progress.engagement[lessonId] = engagement;
  // Auto-set difficulty for next lesson
  const nextLessonId = lessonId + 1;
  if (nextLessonId <= 10) {
    progress.difficulty[nextLessonId] = determineDifficulty(engagement);
  }
  saveProgress(progress);
  return engagement;
}

// === AI Feedback System ===

export function saveAIFeedback(lessonId, feedback) {
  const progress = getProgress();
  progress.aiFeedback[lessonId] = feedback;
  saveProgress(progress);
}

export function getAIFeedback(lessonId) {
  const progress = getProgress();
  return progress.aiFeedback[lessonId] || null;
}
