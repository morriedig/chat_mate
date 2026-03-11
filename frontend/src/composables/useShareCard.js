export function useShareCard() {
  async function generateShareImage(cardElement) {
    // Dynamic import to avoid bundling html2canvas when not needed
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(cardElement, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    })
    return canvas.toDataURL('image/png')
  }

  async function shareProgress(cardElement, text) {
    try {
      const dataUrl = await generateShareImage(cardElement)
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'chat-mate-progress.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Chat Mate Progress',
          text: text || 'Check out my language learning progress!',
          files: [file],
        })
        return true
      } else {
        // Fallback: download the image
        const link = document.createElement('a')
        link.download = 'chat-mate-progress.png'
        link.href = dataUrl
        link.click()
        return true
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err)
      }
      return false
    }
  }

  return { generateShareImage, shareProgress }
}
