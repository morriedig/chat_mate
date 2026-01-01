/**
 * Fisher-Yates shuffle algorithm
 * Returns a new shuffled array without mutating the original
 * @param {Array} array - The array to shuffle
 * @returns {Array} A new shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
