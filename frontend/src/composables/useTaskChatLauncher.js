import { useRouter } from 'vue-router'
import { useNavState } from './useNavState'
import { useDailyPractice } from './useDailyPractice'
import { createPatternTask } from './usePatternTask'
import { characters, levels } from '../data/characters'

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
      character: selectedCharacter.value || characters[0],
      level: levels.find(l => l.id === level.value) || levels.find(l => l.id === 'intermediate'),
      // The AI friend always speaks English while the app focuses on English
      language: 'en',
      mode: 'free',
      scenario: createPatternTask(todayPatterns.value),
    })
    router.push('/chat')
  }

  return { startTaskChat, todayPatterns }
}
