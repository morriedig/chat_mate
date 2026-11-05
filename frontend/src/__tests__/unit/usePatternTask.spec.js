import { describe, it, expect } from 'vitest'
import { createPatternTask, getUsedPatternIds, pickTask, TASKS, PATTERN_TASK_TYPE } from '../../composables/usePatternTask'

const patterns = [
  { id: 'p1', pattern: 'If you ask me, ...', match: ['if you ask me'] },
  { id: 'p2', pattern: "I'd say ..., because ...", match: ["i'd say", 'because'] },
]

describe('usePatternTask', () => {
  it('creates a task chat with the patterns as targets and a prompt naming them', () => {
    const mission = createPatternTask(patterns, TASKS[0])
    expect(mission.type).toBe(PATTERN_TASK_TYPE)
    expect(mission.targets.map(t => t.id)).toEqual(['p1', 'p2'])
    expect(mission.prompt).toContain(TASKS[0].en)
    expect(mission.prompt).toContain('If you ask me, ...')
  })

  it('ticks a pattern only when the user says every part of it', () => {
    const mission = createPatternTask(patterns, TASKS[0])
    const messages = [
      { role: 'assistant', content: 'If you ask me, sushi is better.' },
      { role: 'user', content: 'I would say pizza.' },
      { role: 'user', content: 'If you ask me, the noodles are great.' },
    ]
    expect(getUsedPatternIds(mission, messages)).toEqual(['p1'])
    messages.push({ role: 'user', content: "I'd say yes, because it's cheap." })
    expect(getUsedPatternIds(mission, messages)).toEqual(['p1', 'p2'])
  })

  it('keeps the same task for the whole day', () => {
    const morning = new Date('2026-11-05T01:00:00Z')
    const evening = new Date('2026-11-05T20:00:00Z')
    expect(pickTask(morning)).toBe(pickTask(evening))
  })
})
