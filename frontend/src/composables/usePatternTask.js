import { usesPattern } from './useSentenceCheck'

/**
 * Task chat: a short role-play with one goal, where the learner tries to use
 * today's sentence patterns. Stored in navState.activeScenario like a connector
 * mission, so ChatScreen shows the targets and ticks them off as they're used.
 */

export const PATTERN_TASK_TYPE = 'pattern-task'

export const TASKS = [
  { id: 'restaurant', en: 'Convince your friend to try a new restaurant you like', zh: '說服朋友去試一家你喜歡的新餐廳', ja: '気に入った新しいレストランに行こうと友だちを説得しよう' },
  { id: 'weekend', en: 'Plan this weekend together and agree on what to do', zh: '一起安排這個週末，最後決定要做什麼', ja: '一緒に週末の予定を立てて、何をするか決めよう' },
  { id: 'meeting', en: 'Your friend wants to skip a meeting — give your honest opinion', zh: '朋友想翹掉一場會議，給他你真實的看法', ja: '会議をサボりたい友だちに、正直な意見を伝えよう' },
  { id: 'gift', en: 'Help your friend choose a birthday gift for a coworker', zh: '幫朋友挑一份送同事的生日禮物', ja: '同僚への誕生日プレゼント選びを手伝おう' },
  { id: 'trip', en: 'Decide where to go on a short trip and explain why', zh: '決定短途旅行要去哪裡，並說明原因', ja: '短い旅行の行き先を決めて、理由を説明しよう' },
  { id: 'job', en: 'Your friend got a job offer — talk about whether to take it', zh: '朋友拿到新工作的 offer，聊聊該不該接', ja: '転職のオファーをもらった友だちと、受けるべきか話そう' },
  { id: 'habit', en: 'Talk your friend into starting a small healthy habit with you', zh: '說服朋友跟你一起開始一個小小的健康習慣', ja: '一緒に小さな健康習慣を始めようと友だちを誘おう' },
  { id: 'complaint', en: 'Tell your friend about a problem with a product you bought and ask what to do', zh: '跟朋友說你買的東西出了問題，問他該怎麼辦', ja: '買った物のトラブルを友だちに話して、どうするか相談しよう' },
]

// Same task all day so reopening the chat doesn't change the goal
export function pickTask(date = new Date()) {
  const day = Math.floor(date.getTime() / 86400000)
  return TASKS[day % TASKS.length]
}

export function taskText(task, lang) {
  return task[lang] || task.en
}

export function buildTaskPrompt(task, patterns) {
  return `[System: Task chat — you are the user's friend, NOT a teacher.

The user's goal in this chat: ${task.en}. Play your part in that situation naturally, open by setting the scene in one or two sentences, and react to what they say. Push back a little now and then so they have to explain or persuade.

The user is quietly practicing these sentence patterns: ${patterns.map(p => p.pattern).join(' | ')}. Do NOT mention, teach, or quiz them, and never comment on their grammar. Give them natural openings where those patterns fit.

Keep replies short (2-3 sentences) and end with a question.]`
}

/**
 * @param {Array} patterns - Today's daily-practice patterns ({ id, pattern, match })
 * @param {Object} [task] - From TASKS; defaults to today's task
 */
export function createPatternTask(patterns, task = pickTask()) {
  const dateKey = new Date().toISOString().slice(0, 10)
  return {
    id: `task_${dateKey}_${task.id}`,
    type: PATTERN_TASK_TYPE,
    task,
    targets: patterns.map(p => ({ id: p.id, phrase: p.pattern, match: p.match || [] })),
    prompt: buildTaskPrompt(task, patterns),
    freshStart: false,
  }
}

/**
 * Which target patterns the user has used so far, in target order.
 */
export function getUsedPatternIds(mission, messages) {
  if (!mission) return []
  const userLines = messages.filter(m => m.role === 'user').map(m => m.content)
  return mission.targets
    .filter(target => userLines.some(line => usesPattern(line, target.match)))
    .map(target => target.id)
}
