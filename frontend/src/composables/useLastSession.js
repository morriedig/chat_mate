const STORAGE_KEY = 'chatmate_lastSession'

export function useLastSession() {
  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Storage unavailable
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function saveChatSession({ characterId, levelId, language, mode }) {
    save({
      type: 'chat',
      characterId,
      levelId,
      language,
      mode,
    })
  }

  function saveLearningSession({ levelId, targetLanguage, motherTongue, uiLanguage }) {
    save({
      type: 'learning',
      levelId,
      targetLanguage,
      motherTongue,
      uiLanguage,
    })
  }

  return {
    load,
    saveChatSession,
    saveLearningSession,
  }
}
