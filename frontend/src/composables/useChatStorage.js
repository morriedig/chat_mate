import { watch, onBeforeUnmount, getCurrentInstance } from 'vue'

function compress(str) {
  if (!str) return ''
  return btoa(encodeURIComponent(str))
}

function decompress(str) {
  if (!str) return ''
  try {
    return decodeURIComponent(atob(str))
  } catch {
    return ''
  }
}

export function useChatStorage(keyConfig) {
  function getStorageKey() {
    const { language, characterId, levelId, isArticleMode, articleId } = keyConfig.value
    const base = `chatmate_${language}_${characterId}_${levelId}`
    if (isArticleMode && articleId) {
      return `${base}_article_${articleId}`
    }
    return base
  }

  function save(messages, hints) {
    const key = getStorageKey()
    const data = JSON.stringify({ messages, hints })
    localStorage.setItem(key, compress(data))
  }

  function load() {
    const key = getStorageKey()
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const data = decompress(stored)
        const parsed = JSON.parse(data)
        if (Array.isArray(parsed)) {
          return { messages: parsed, hints: [] }
        }
        return { messages: parsed.messages || [], hints: parsed.hints || [] }
      } catch {
        return { messages: [], hints: [] }
      }
    }
    return { messages: [], hints: [] }
  }

  function clear() {
    const key = getStorageKey()
    localStorage.removeItem(key)
  }

  function autoSave(messagesRef, hintsRef) {
    let timer = null
    const stop = watch([messagesRef, hintsRef], () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        save(messagesRef.value, hintsRef.value)
      }, 1000)
    }, { deep: true })

    function cleanup() {
      if (timer) {
        clearTimeout(timer)
        save(messagesRef.value, hintsRef.value)
      }
      stop()
    }

    if (getCurrentInstance()) {
      onBeforeUnmount(cleanup)
    }

    return cleanup
  }

  return {
    save,
    load,
    clear,
    autoSave,
    getStorageKey
  }
}
