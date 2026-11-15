import { useRouter } from 'vue-router'
import { useNavState } from './useNavState'
import { useDailyPractice } from './useDailyPractice'
import { createPatternTask } from './usePatternTask'
import { levels, characterFor } from '../data/characters'
import { TARGET_LANG, DEFAULT_LEVEL } from '../edition'

/**
 * Opens the task chat with today's daily-practice patterns as targets.
 * Used from the home screen and from the end of daily practice.
 */
export function useTaskChatLauncher() {
  const router = useRouter()
  const { setChatState, selectedCharacter } = useNavState()
  const { todayPatterns, level } = useDailyPractice()

  function startTaskChat() {
    setChatState({
      // The last chosen friend if they speak the language being learned, else the first who does
      character: characterFor(TARGET_LANG, selectedCharacter.value),
      level: levels.find(l => l.id === level.value) || levels.find(l => l.id === DEFAULT_LEVEL),
      // The AI friend speaks the language this edition teaches
      language: TARGET_LANG,
      mode: 'free',
      scenario: createPatternTask(todayPatterns.value),
    })
    router.push('/chat')
  }

  return { startTaskChat, todayPatterns }
}
