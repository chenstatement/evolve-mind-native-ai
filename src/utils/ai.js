// AI API configuration
const DEFAULT_CONFIG = {
  baseURL: localStorage.getItem('ai_base_url') || 'https://api.kimi.com/coding',
  apiKey: localStorage.getItem('ai_api_key') || '',
  model: localStorage.getItem('ai_model') || 'kimi-for-coding'
}

export function getAIConfig() {
  return {
    baseURL: localStorage.getItem('ai_base_url') || DEFAULT_CONFIG.baseURL,
    apiKey: localStorage.getItem('ai_api_key') || '',
    model: localStorage.getItem('ai_model') || 'kimi-for-coding'
  }
}

export function saveAIConfig(config) {
  localStorage.setItem('ai_base_url', config.baseURL)
  localStorage.setItem('ai_api_key', config.apiKey)
  localStorage.setItem('ai_model', config.model)
}

export function hasAIConfig() {
  const config = getAIConfig()
  return config.apiKey.length > 10
}

// Build system prompt for the AI coach
function buildSystemPrompt(lesson, section) {
  return `你是「思维进化训练营」的AI思维教练。你的角色是老师、助手和朋友的多重身份。

当前课程：第${lesson.id}课「${lesson.title}」
当前环节：${section?.title || '课后讨论'}

你的风格：
- 温暖、鼓励、有洞察力
- 善于用提问引导思考，而不是直接给答案
- 能够识别学员的回答深度，并给出针对性反馈
- 偶尔引用科学家的故事来佐证观点

重要原则：
- 不要一次性说太多，保持对话感
- 如果学员回答很浅，用追问引导深入
- 如果学员回答有深度，给予肯定并进一步拓展
- 每次回复控制在150字以内

课程内容参考：
${section?.content?.slice(0, 500) || ''}`
}

// Call real AI API
export async function callAI(message, lesson, section, history = []) {
  const config = getAIConfig()

  if (!config.apiKey) {
    throw new Error('NO_API_KEY')
  }

  const messages = [
    { role: 'system', content: buildSystemPrompt(lesson, section) },
    ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message }
  ]

  try {
    const response = await fetch(`${config.baseURL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: 500,
        temperature: 0.8
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || '抱歉，我没有理解你的意思。能再说一遍吗？'
  } catch (err) {
    console.error('AI API call failed:', err)
    throw err
  }
}

// Simulated AI responses (fallback when no API key)
const responsePatterns = {
  '运气|幸运|巧合': '很好的思考！但费曼的「运气」其实是大量观察训练的结果。就像摄影师能瞬间捕捉最佳光线，背后是成千上万次的练习。你觉得生活中有哪些「运气」其实是「准备」？',
  '准备|积累|训练|练习': '完全正确！费曼 himself 说过：「我没有特殊天赋，我只是极度好奇。」这种「有准备的头脑」是可以训练的。你每天会给自己留出「观察时间」吗？',
  '不知道|不明白|不懂': '没关系，思考本身就是一个过程。让我换个方式问你：如果你把这个问题讲给一个10岁小孩听，你会怎么讲？',
  '同意|对的|是的|没错': '很高兴我们有共鸣！那接下来我想挑战你一下：如果站在反对者的角度，他们会怎么反驳这个观点？',
  '观察|细节|注意': '观察力确实是一切思维的起点。给你一个具体挑战：接下来24小时，每天记录3个你以前忽略的细节。愿意接受吗？',
  'default': '这是一个很有深度的思考！伟大的发现往往藏在「无聊」的观察中。关键在于——你是否愿意停下来，多看一眼？作为这节思维进化课的一部分，我想问你：接下来一周，你打算如何培养自己的观察习惯？'
}

export function getSimulatedResponse(input) {
  for (const [pattern, response] of Object.entries(responsePatterns)) {
    if (pattern === 'default') continue
    const regex = new RegExp(pattern)
    if (regex.test(input)) {
      return response
    }
  }
  return responsePatterns.default
}

// === Homework Feedback System ===

function buildHomeworkPrompt(homeworkText, tasks, lesson) {
  return `你是「思维进化训练营」的AI思维教练。请对学员的作业进行逐条点评。

课程：第${lesson.id}课「${lesson.title}」

作业任务：
${tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}

学员提交内容：
${homeworkText}

请按以下JSON格式输出点评（不要输出其他内容）：
{
  "overall": "总体评价（100字以内，鼓励式结尾）",
  "items": [
    {
      "task": "任务1的简短描述",
      "strength": "学员在这个任务中的亮点（具体、真诚）",
      "suggestion": "具体的改进建议（不说标准答案，用提问引导）"
    }
  ]
}

原则：
- 先肯定亮点，再提建议
- 建议要具体，不要空泛
- 用提问引导思考，不给标准答案
- 语气温暖、鼓励`;
}

export async function callAIFeedback(homeworkText, tasks, lesson) {
  const config = getAIConfig();

  if (!config.apiKey) {
    // Return simulated feedback
    return getSimulatedFeedback(homeworkText, tasks);
  }

  const messages = [
    { role: 'system', content: buildHomeworkPrompt(homeworkText, tasks, lesson) },
    { role: 'user', content: homeworkText }
  ];

  try {
    const response = await fetch(`${config.baseURL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    return parseAIFeedback(content);
  } catch (err) {
    console.error('AI feedback failed:', err);
    return getSimulatedFeedback(homeworkText, tasks);
  }
}

function getSimulatedFeedback(homeworkText, tasks) {
  const items = tasks.map((task, i) => {
    let strength = '你认真完成了这个任务，这种主动思考的习惯本身就是最大的收获。';
    let suggestion = '下次可以尝试用更多具体的例子来支撑你的观察，这样会让思考更有深度。';

    if (homeworkText.includes('观察') || homeworkText.includes('细节')) {
      strength = '你对细节的观察很敏锐，这是科学家思维的重要特质！';
      suggestion = '试着追问自己：「我观察到的这个现象，背后可能隐藏着什么规律？」';
    } else if (homeworkText.includes('为什么') || homeworkText.includes('因为')) {
      strength = '你很善于追问原因，这种「打破砂锅问到底」的精神非常可贵。';
      suggestion = '除了问「为什么」，也可以尝试问「如果不是这样呢？」——反向思考往往有新发现。';
    } else if (homeworkText.includes('感觉') || homeworkText.includes('觉得')) {
      strength = '你愿意倾听自己的内心感受，这是一种很好的自我觉察。';
      suggestion = '试着把「我觉得」换成「我注意到」，看看会不会发现新的视角？';
    }

    return {
      task: task.slice(0, 30) + (task.length > 30 ? '...' : ''),
      strength,
      suggestion
    };
  });

  return {
    overall: '很高兴看到你认真完成了这份作业！思维进化不在于完美，而在于持续练习。每一个「为什么」都在重塑你的大脑。继续加油！',
    items
  };
}

export function parseAIFeedback(response) {
  try {
    // Try to extract JSON from markdown code blocks or raw text
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                      response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      return {
        overall: parsed.overall || '作业完成得很棒！继续保持这种思考的习惯。',
        items: Array.isArray(parsed.items) ? parsed.items : []
      };
    }
  } catch (e) {
    console.warn('Failed to parse AI feedback JSON:', e);
  }

  // Fallback: return the raw text as overall feedback
  return {
    overall: response.slice(0, 200) || '作业完成得很棒！继续保持这种思考的习惯。',
    items: []
  };
}
