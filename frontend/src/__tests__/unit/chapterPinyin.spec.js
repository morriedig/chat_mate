import { describe, it, expect } from 'vitest'
import { transformWords, transformConversations } from '../../data/chapterLoader'

const chapter = {
  meta: { id: 'ordering' },
  words: [{
    id: 'yao',
    word: { zh: '要', en: 'to want' },
    description: { zh: '想得到', en: 'to want something' },
    sentence: { zh: '我要一杯珍奶。', en: 'I want a bubble tea.' },
    phonetic: '/wɑnt/',
    reading: 'よう',
    pinyin: 'yào',
    sentencePinyin: 'wǒ yào yì bēi zhēn nǎi.',
  }],
  chat: {
    conversations: [{
      id: 'c1',
      title: { zh: '點飲料', en: 'Ordering a drink' },
      messages: [{ role: 'user', text: { zh: '我要一杯珍奶。', en: 'I want a bubble tea.' }, pinyin: 'wǒ yào yì bēi zhēn nǎi.' }],
    }],
  },
}

describe('chapter pinyin', () => {
  it('passes the word and sentence pinyin to Chinese word cards', () => {
    const [word] = transformWords(chapter, 'zh', 'en')
    expect(word).toMatchObject({ word: '要', nativeWord: 'to want', pinyin: 'yào', sentencePinyin: 'wǒ yào yì bēi zhēn nǎi.' })
    expect(word.phonetic).toBeUndefined()
    expect(word.reading).toBeUndefined()
  })

  it('passes pinyin on Chinese conversation lines', () => {
    const [conv] = transformConversations(chapter, 'zh', 'en')
    expect(conv.messages[0]).toEqual({ role: 'user', text: '我要一杯珍奶。', nativeText: 'I want a bubble tea.', pinyin: 'wǒ yào yì bēi zhēn nǎi.' })
  })

  it('leaves English and Japanese cards and lines as they were', () => {
    const [en] = transformWords(chapter, 'en', 'zh')
    expect(en).not.toHaveProperty('pinyin')
    expect(en).not.toHaveProperty('sentencePinyin')
    expect(en.phonetic).toBe('/wɑnt/')
    expect(transformWords(chapter, 'ja', 'en')[0]).not.toHaveProperty('pinyin')
    expect(transformConversations(chapter, 'en', 'zh')[0].messages[0]).toEqual({ role: 'user', text: 'I want a bubble tea.', nativeText: '我要一杯珍奶。' })
  })
})
