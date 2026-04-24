import { useState } from 'react'
import { getAIConfig, saveAIConfig } from '../utils/ai'

export default function AIConfig({ onBack }) {
  const [config, setConfig] = useState(getAIConfig)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveAIConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-cream px-5 pt-6 pb-24">
      <button onClick={onBack} className="text-ink-light text-sm mb-4 flex items-center gap-1">
        ← 返回
      </button>

      <h1 className="text-xl font-bold text-ink mb-2">AI 配置</h1>
      <p className="text-sm text-ink-light mb-6">
        配置你的AI API，让思维教练真正「活」起来
      </p>

      <div className="bg-white rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">API Key</label>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            placeholder="sk- 或 ds- 开头"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
          />
          <p className="text-xs text-ink-light mt-1">
            默认使用 DeepSeek API（兼容 OpenAI 格式）
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">API Base URL</label>
          <input
            type="text"
            value={config.baseURL}
            onChange={(e) => setConfig({ ...config, baseURL: e.target.value })}
            placeholder="https://api.openai.com/v1"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">模型</label>
          <input
            type="text"
            value={config.model}
            onChange={(e) => setConfig({ ...config, model: e.target.value })}
            placeholder="gpt-4 / claude-3-sonnet / kimi-for-coding"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gold text-white font-semibold py-3 rounded-xl"
        >
          {saved ? '✓ 已保存' : '保存配置'}
        </button>
      </div>

      <div className="mt-4 bg-amber-50 rounded-xl p-4">
        <p className="text-xs text-amber-700">
          <strong>提示：</strong>API Key 仅存储在你的设备本地（localStorage），不会上传到任何服务器。
          如果不配置，将使用内置的模拟AI进行对话。
        </p>
      </div>
    </div>
  )
}
