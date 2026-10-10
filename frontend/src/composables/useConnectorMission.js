import { shuffleArray } from '../utils/shuffle'
import { detectConnectors } from '../utils/connectorDetect'

// "Use it in chat" bridge: after a chapter quiz, the user chats with an AI
// friend and tries to use 3 target connectors. The mission rides on the
// existing scenario mechanism (navState.activeScenario → challengeContext),
// so no backend/API change is needed.

export const MISSION_TYPE = 'connector-mission'
const MISSION_SIZE = 3

// Everyday / work opinion topics for the friend to open with
const TOPICS = [
  'whether working from home is better than going to the office',
  'whether meetings at work should be shorter',
  'whether it is worth owning a car in a big city',
  'cooking at home versus eating out on weekdays',
  'whether it is OK to answer work messages after hours',
  'the best way to spend a long weekend',
  'whether people should switch jobs every few years',
  'whether kids should learn to code at school',
  'living in the city center versus the suburbs',
  'whether paying for streaming services is still worth it',
]

/**
 * Pick target connectors: ones the user got wrong first, then ones they
 * practiced in the quiz, then any other chapter connector.
 * @param {Array<{id: string}>} connectors - Detectable chapter connectors
 * @param {{missedTargetIds?: string[], practicedTargetIds?: string[]}} result
 * @param {number} count
 * @returns {string[]} Target ids
 */
export function pickMissionTargets(connectors, { missedTargetIds = [], practicedTargetIds = [] } = {}, count = MISSION_SIZE) {
  const available = new Set(connectors.map(c => c.id))
  const picked = []
  const add = (id) => {
    if (picked.length < count && available.has(id) && !picked.includes(id)) picked.push(id)
  }
  missedTargetIds.forEach(add)
  shuffleArray([...new Set(practicedTargetIds)]).forEach(add)
  shuffleArray(connectors.map(c => c.id)).forEach(add)
  return picked
}

/**
 * Build the [System: ...] note appended to the AI system prompt.
 */
export function buildMissionPrompt(targetPhrases, topic) {
  return `[System: Casual opinion chat — you are the user's friend, NOT a teacher.

Open by casually asking what the user thinks about ${topic}. Share your own view briefly too.

When the user gives an opinion, ask a natural "why?" / "how come?" follow-up so they explain their reasons. If they already gave a reason, react to it and ask about another angle.

The user is quietly practicing these connectors: ${targetPhrases.join(', ')}. Do NOT mention, teach, quiz, or correct them, and never praise their grammar. You may use them yourself now and then, naturally. You may suggest them via hints where they fit.

Keep replies short (2-3 sentences) and end with a question. Never lecture.]`
}

/**
 * Create the scenario object stored in navState.activeScenario.
 * @param {Object} opts
 * @param {string} opts.chapterId
 * @param {string} opts.title - Localized chapter title
 * @param {Array<{id: string, phrase: string}>} opts.connectors - All chapter connectors
 * @param {string[]} opts.targetIds - Ids picked by pickMissionTargets
 */
export function createMission({ chapterId, title, connectors, targetIds }) {
  const targets = targetIds
    .map(id => connectors.find(c => c.id === id))
    .filter(Boolean)
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]

  return {
    id: `mission_${chapterId}`,
    type: MISSION_TYPE,
    title,
    goal: targets.map(t => t.phrase).join(', '),
    chapterId,
    // Full list is kept so longer phrases shadow shorter ones in detection
    connectors,
    targets,
    prompt: buildMissionPrompt(targets.map(t => t.phrase), topic),
    // ChatScreen clears the stored history once so each run starts fresh
    freshStart: true,
  }
}

/**
 * Which mission targets appear in the user's messages so far.
 * @param {Object} mission - From createMission
 * @param {Array<{role: string, content: string}>} messages
 * @returns {string[]} Used target ids, in target order
 */
export function getUsedTargetIds(mission, messages) {
  if (!mission) return []
  const used = new Set()
  for (const msg of messages) {
    if (msg.role !== 'user') continue
    detectConnectors(msg.content, mission.connectors).forEach(id => used.add(id))
  }
  return mission.targets.map(t => t.id).filter(id => used.has(id))
}
