import { describe, it, expect } from 'vitest'
import { shuffleArray } from '../../utils/shuffle'

describe('shuffleArray', () => {
  it('should return a new array without mutating the original', () => {
    const original = [1, 2, 3, 4, 5]
    const originalCopy = [...original]
    const shuffled = shuffleArray(original)

    expect(original).toEqual(originalCopy)
    expect(shuffled).not.toBe(original)
  })

  it('should return an array with the same length', () => {
    const original = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(original)

    expect(shuffled.length).toBe(original.length)
  })

  it('should contain all original elements', () => {
    const original = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(original)

    expect(shuffled.sort()).toEqual(original.sort())
  })

  it('should handle empty arrays', () => {
    const result = shuffleArray([])
    expect(result).toEqual([])
  })

  it('should handle single element arrays', () => {
    const result = shuffleArray([42])
    expect(result).toEqual([42])
  })

  it('should handle arrays with duplicate values', () => {
    const original = [1, 1, 2, 2, 3]
    const shuffled = shuffleArray(original)

    expect(shuffled.sort()).toEqual(original.sort())
  })

  it('should handle arrays of objects', () => {
    const original = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 3, name: 'c' }
    ]
    const shuffled = shuffleArray(original)

    expect(shuffled.length).toBe(3)
    expect(shuffled.map(o => o.id).sort()).toEqual([1, 2, 3])
  })

  it('should actually shuffle (probabilistic test)', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let sameOrderCount = 0
    const iterations = 100

    for (let i = 0; i < iterations; i++) {
      const shuffled = shuffleArray(original)
      if (JSON.stringify(shuffled) === JSON.stringify(original)) {
        sameOrderCount++
      }
    }

    // It's extremely unlikely to get the same order more than a few times
    expect(sameOrderCount).toBeLessThan(iterations * 0.1)
  })
})
