import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mocks = vi.hoisted(() => ({ native: false, plugin: {} }))
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => mocks.native } }))
vi.mock('@capgo/capacitor-speech-recognition', () => ({ SpeechRecognition: mocks.plugin }))

// Minimal Web Speech API stand-in: tests drive results and the end event by hand
class FakeRecognition {
  constructor() {
    FakeRecognition.last = this
    this.stopped = false
  }
  start() {}
  stop() {
    if (this.stopped) return
    this.stopped = true
    this.onend?.()
  }
  say(text) {
    this.onresult?.({ resultIndex: 0, results: [Object.assign([{ transcript: text }], { isFinal: true })] })
  }
}

async function loadStt() {
  vi.resetModules()
  window.webkitSpeechRecognition = FakeRecognition
  return import('../../utils/stt')
}

describe('stt (web)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })
  afterEach(() => {
    vi.useRealTimers()
    delete window.webkitSpeechRecognition
  })

  it('ends the turn after the chosen pause following speech', async () => {
    const { listenOnce } = await loadStt()
    const result = listenOnce({ pauseMs: 2500 })
    FakeRecognition.last.say('I think so')

    vi.advanceTimersByTime(2400)
    expect(FakeRecognition.last.stopped).toBe(false)
    vi.advanceTimersByTime(200)
    expect(await result).toBe('I think so')
  })

  it('uses the saved pause setting by default', async () => {
    localStorage.setItem('chatmate_voice_pause_ms', '4000')
    const { listenOnce } = await loadStt()
    const result = listenOnce()
    FakeRecognition.last.say('Well')

    vi.advanceTimersByTime(3900)
    expect(FakeRecognition.last.stopped).toBe(false)
    vi.advanceTimersByTime(200)
    expect(await result).toBe('Well')
  })

  it('"still thinking" keeps the turn open longer', async () => {
    const { listenOnce, extendListening, THINKING_GRACE_MS } = await loadStt()
    const result = listenOnce({ pauseMs: 1500 })
    FakeRecognition.last.say('Hmm')

    vi.advanceTimersByTime(1000)
    expect(extendListening()).toBe(true)
    vi.advanceTimersByTime(1500 + THINKING_GRACE_MS - 100)
    expect(FakeRecognition.last.stopped).toBe(false)
    vi.advanceTimersByTime(200)
    expect(await result).toBe('Hmm')
  })

  it('reports nothing to extend when not listening', async () => {
    const { extendListening } = await loadStt()
    expect(extendListening()).toBe(false)
  })

  it('stops at the max listen time even while speaking', async () => {
    const { listenOnce } = await loadStt()
    const result = listenOnce({ pauseMs: 4000, maxMs: 5000 })
    for (let i = 0; i < 4; i++) {
      FakeRecognition.last.say('word ')
      vi.advanceTimersByTime(1000)
    }
    vi.advanceTimersByTime(1100)
    expect(FakeRecognition.last.stopped).toBe(true)
    await result
  })
})

// Stand-in for the native plugin, like the iOS one: start() is refused while a session is
// active, and stop() keeps the session active until it resolves (after a delay, waiting for the
// final result); that session's "stopped" event comes after stop() resolves
const STOP_DELAY_MS = 20

function createNativePlugin() {
  const listeners = {}
  const emit = (name, event) => (listeners[name] || []).forEach(cb => cb(event))
  const plugin = {
    running: false,
    stopping: null,
    session: 0,
    permissionGate: null,
    checkPermissions: vi.fn(async () => {
      if (plugin.permissionGate) await plugin.permissionGate
      return { speechRecognition: 'granted' }
    }),
    requestPermissions: vi.fn(async () => ({ speechRecognition: 'granted' })),
    addListener: vi.fn(async (name, callback) => {
      (listeners[name] ||= []).push(callback)
      return { remove: () => { listeners[name] = listeners[name].filter(cb => cb !== callback) } }
    }),
    start: vi.fn(async () => {
      if (plugin.running) throw new Error('Speech recognition is already running.')
      plugin.running = true
      plugin.session++
      emit('listeningState', { state: 'started', sessionId: plugin.session, status: 'started' })
    }),
    stop: vi.fn(() => {
      if (!plugin.running) return Promise.resolve()
      if (plugin.stopping) return plugin.stopping
      const sessionId = plugin.session
      plugin.stopping = new Promise(resolve => setTimeout(() => {
        plugin.running = false
        plugin.stopping = null
        resolve()
        setTimeout(() => emit('listeningState', { state: 'stopped', sessionId, status: 'stopped' }), 0)
      }, STOP_DELAY_MS))
      return plugin.stopping
    }),
    say: (text) => emit('partialResults', { matches: [text] }),
    emit,
  }
  return plugin
}

const settle = () => new Promise(resolve => setTimeout(resolve, 0))

describe('stt (native)', () => {
  let plugin
  beforeEach(() => {
    mocks.native = true
    plugin = createNativePlugin()
    for (const key of Object.keys(mocks.plugin)) delete mocks.plugin[key]
    Object.assign(mocks.plugin, plugin)
  })
  afterEach(() => {
    mocks.native = false
  })

  async function loadNativeStt() {
    vi.resetModules()
    return import('../../utils/stt')
  }

  it('finishes the running listen before starting a new one', async () => {
    const { listenOnce, stopListening } = await loadNativeStt()
    const first = listenOnce()
    await settle()
    plugin.say('first words')

    const second = listenOnce()
    expect(await first).toBe('first words')
    await vi.waitFor(() => expect(plugin.start).toHaveBeenCalledTimes(2))
    expect(plugin.running).toBe(true)

    // The new listen still has its stop control
    plugin.say('second words')
    stopListening()
    expect(await second).toBe('second words')
    expect(plugin.running).toBe(false)
  })

  it('does not start when stopped during the permission check', async () => {
    const { listenOnce, stopListening } = await loadNativeStt()
    let grant
    plugin.permissionGate = new Promise(resolve => { grant = resolve })
    const result = listenOnce()
    stopListening()
    grant()
    expect(await result).toBe('')
    expect(plugin.start).not.toHaveBeenCalled()
  })

  it("an older listen's cleanup keeps the newer listen's stop control", async () => {
    const { listenOnce, stopListening } = await loadNativeStt()
    const first = listenOnce()
    await settle()

    // The newer listen waits on permissions while the older one is cleaned up
    let grant
    plugin.permissionGate = new Promise(resolve => { grant = resolve })
    const second = listenOnce()
    expect(await first).toBe('')
    stopListening()
    grant()
    expect(await second).toBe('')
    expect(plugin.start).toHaveBeenCalledTimes(1)
  })

  it("ignores a previous session's late \"stopped\" and ends on its own", async () => {
    const { listenOnce, stopListening } = await loadNativeStt()
    const first = listenOnce()
    await settle()
    stopListening()
    expect(await first).toBe('')

    // Session 1's "stopped" is still on its way when the next listen starts
    const second = listenOnce()
    await vi.waitFor(() => expect(plugin.start).toHaveBeenCalledTimes(2))
    plugin.say('still here')

    let settled = false
    second.then(() => { settled = true })
    plugin.emit('listeningState', { state: 'stopped', sessionId: 1, status: 'stopped' })
    await settle()
    expect(settled).toBe(false)

    // The recognizer ending session 2 by itself does end this listen
    plugin.emit('listeningState', { state: 'stopped', sessionId: 2, status: 'stopped' })
    expect(await second).toBe('still here')
  })

  it('a listen started right after stopListening waits for the stop to finish', async () => {
    const { listenOnce, stopListening } = await loadNativeStt()
    const first = listenOnce()
    await vi.waitFor(() => expect(plugin.start).toHaveBeenCalledTimes(1))
    plugin.say('first words')

    stopListening()
    const second = listenOnce()
    expect(await first).toBe('first words')
    await vi.waitFor(() => expect(plugin.start).toHaveBeenCalledTimes(2))
    expect(plugin.running).toBe(true)

    plugin.say('second words')
    stopListening()
    expect(await second).toBe('second words')
    expect(plugin.running).toBe(false)
  })
})
