import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addDays } from '../../composables/useSpeakingQueue'

const TODAY = '2026-11-06'
const TOMORROW = '2026-11-07'

async function load() {
  const { useSpeakingQueue } = await import('../../composables/useSpeakingQueue')
  return useSpeakingQueue()
}

const repeat = { enabled: true, original: 'Yesterday I go to the office', target: 'Yesterday I went to the office', cue: '說說你昨天去了辦公室', hint: '注意昨天發生的事', patternId: '' }

describe('addDays', () => {
  it('moves across month and year ends', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })
})

describe('useSpeakingQueue', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('keeps one pending item per date unless asked to replace', async () => {
    const q = await load()
    const first = q.enqueue({ source: 'chat-summary', cue: 'a', target: 'A b', scheduledFor: TOMORROW })
    expect(first).not.toBeNull()
    expect(q.enqueue({ source: 'chat-summary', cue: 'b', target: 'B c', scheduledFor: TOMORROW })).toBeNull()

    const second = q.enqueue({ source: 'chat-summary', cue: 'b', target: 'B c', scheduledFor: TOMORROW, replace: true })
    expect(q.pending.value.map(i => i.id)).toEqual([second.id])
    expect(JSON.parse(localStorage.getItem('chatmate_speaking_queue')).version).toBe(1)
  })

  it('moves a hard sentence aside instead of dropping it on replace', async () => {
    const q = await load()
    const hard = q.enqueue({ source: 'pattern-fallback', cue: 'task', scheduledFor: TOMORROW })
    const fresh = q.enqueue({ source: 'chat-summary', cue: 'cue', target: 'A b', scheduledFor: TOMORROW, replace: true })
    expect(q.getItem(fresh.id).scheduledFor).toBe(TOMORROW)
    expect(q.getItem(hard.id).scheduledFor).toBe('2026-11-08')
  })

  it('picks the earliest due item', async () => {
    const q = await load()
    q.enqueue({ source: 'chat-summary', cue: 'later', target: 'x y', scheduledFor: TODAY })
    const early = q.enqueue({ source: 'chat-summary', cue: 'early', target: 'x y', scheduledFor: '2026-11-04' })
    q.enqueue({ source: 'chat-summary', cue: 'future', target: 'x y', scheduledFor: TOMORROW })
    expect(q.nextDue(TODAY).id).toBe(early.id)
  })

  it("'again' moves the item to the next free day, 'got-it' finishes it", async () => {
    const q = await load()
    const item = q.enqueue({ source: 'chat-summary', cue: 'c', target: 'x y', scheduledFor: TODAY })
    q.enqueue({ source: 'chat-summary', cue: 'd', target: 'x y', scheduledFor: TOMORROW })

    q.recordAttempt(item.id, { mode: 'voice', text: 'x y', selfRating: 'again' }, TODAY)
    expect(q.getItem(item.id).scheduledFor).toBe('2026-11-08')
    expect(q.getItem(item.id).completedAt).toBeNull()

    q.recordAttempt(item.id, { mode: 'text', text: 'x y', selfRating: 'got-it' }, '2026-11-08')
    expect(q.getItem(item.id).completedAt).toBeTruthy()
    expect(q.getItem(item.id).attempts.map(a => [a.mode, a.selfRating])).toEqual([['voice', 'again'], ['text', 'got-it']])
  })

  describe('queueRepeatTomorrow', () => {
    it('books the sentence for the next local date', async () => {
      const q = await load()
      const result = q.queueRepeatTomorrow(repeat, { sourceId: 'task_1', today: TODAY })
      expect(result.status).toBe('queued')
      expect(result.item).toMatchObject({ source: 'chat-summary', sourceId: 'task_1', target: repeat.target, cue: repeat.cue, scheduledFor: TOMORROW })
    })

    it('ignores a disabled or empty sentence', async () => {
      const q = await load()
      expect(q.queueRepeatTomorrow({ ...repeat, enabled: false }, { today: TODAY }).status).toBe('none')
      expect(q.queueRepeatTomorrow(null, { today: TODAY }).status).toBe('none')
      expect(q.pending.value).toHaveLength(0)
    })

    it('leaves another chat’s sentence in place until the learner replaces it', async () => {
      const q = await load()
      q.queueRepeatTomorrow(repeat, { sourceId: 'task_1', today: TODAY })
      const other = { ...repeat, original: 'She like it', target: 'She likes it', cue: '說她喜歡' }

      const taken = q.queueRepeatTomorrow(other, { sourceId: 'task_2', today: TODAY })
      expect(taken.status).toBe('taken')
      expect(q.itemFor(TOMORROW).target).toBe(repeat.target)

      const replaced = q.queueRepeatTomorrow(other, { sourceId: 'task_2', today: TODAY, replace: true })
      expect(replaced.status).toBe('queued')
      expect(q.pending.value.map(i => i.target)).toEqual(['She likes it'])
    })

    it('lets a newer summary of the same chat replace its own sentence', async () => {
      const q = await load()
      q.queueRepeatTomorrow(repeat, { sourceId: 'task_1', today: TODAY })
      const again = q.queueRepeatTomorrow(repeat, { sourceId: 'task_1', today: TODAY })
      expect(again.status).toBe('queued')
      const newer = q.queueRepeatTomorrow({ ...repeat, target: 'Yesterday I went to work' }, { sourceId: 'task_1', today: TODAY })
      expect(newer.status).toBe('queued')
      expect(q.pending.value.map(i => i.target)).toEqual(['Yesterday I went to work'])
    })
  })
})
