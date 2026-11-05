import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatHeader from '../../components/chat/ChatHeader.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key, params) => (params ? `${key}:${JSON.stringify(params)}` : key)
  })
}))

// Mock useDarkMode
const toggleDark = vi.fn()
vi.mock('../../composables/useDarkMode', () => ({
  useDarkMode: () => ({
    isDark: { value: false },
    toggle: toggleDark
  })
}))

describe('ChatHeader', () => {
  const mockCharacter = {
    id: 'sakura',
    name: 'Sakura',
    avatar: '🌸'
  }

  const mockLevel = {
    id: 'beginner',
    name: 'Beginner'
  }

  const createWrapper = (props = {}) => {
    return mount(ChatHeader, {
      props: {
        character: mockCharacter,
        level: mockLevel,
        ...props
      },
      attachTo: document.body
    })
  }

  const openMenu = async (props = {}) => {
    const wrapper = createWrapper(props)
    await wrapper.find('[aria-label="chat.menu"]').trigger('click')
    return wrapper
  }
  const menuItem = (wrapper, text) => wrapper.findAll('[role="menuitem"]').find(btn => btn.text().includes(text))

  describe('rendering', () => {
    it('should render header element', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('header').exists()).toBe(true)
    })

    it('should show a monogram avatar instead of the emoji', () => {
      const wrapper = createWrapper()
      const avatar = wrapper.find('[role="img"]')
      expect(avatar.text()).toBe('S')
      expect(avatar.attributes('aria-label')).toBe('Sakura')
      expect(wrapper.text()).not.toContain('🌸')
    })

    it('should display character name and level', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('h1').text()).toBe('Sakura')
      expect(wrapper.text()).toContain('levels.beginner.name')
    })

    it('should show which conversation this is after the first', () => {
      expect(createWrapper({ conversationCount: 1 }).text()).not.toContain('chat.conversationNumber')
      expect(createWrapper({ conversationCount: 3 }).text()).toContain('chat.conversationNumber:{"n":3}')
    })

    it('keeps only back, friend and the overflow menu in the bar', () => {
      const wrapper = createWrapper()
      // No online badge, rank, streak or daily goal in a conversation header
      expect(wrapper.text()).not.toContain('chat.online')
      expect(wrapper.find('.rank-badge-stub').exists()).toBe(false)
      expect(wrapper.findAll('button').length).toBe(2)
    })
  })

  describe('article mode', () => {
    it('should mark article mode in the subtitle', () => {
      expect(createWrapper({ isArticleMode: true }).text()).toContain('chat.articleMode')
      expect(createWrapper({ isArticleMode: false }).text()).not.toContain('chat.articleMode')
    })

    it('offers "hide article" or "show article" in the menu', async () => {
      expect(menuItem(await openMenu({ isArticleMode: true, showArticle: true }), 'chat.hideArticle')).toBeTruthy()
      expect(menuItem(await openMenu({ isArticleMode: true, showArticle: false }), 'chat.showArticle')).toBeTruthy()
      expect(menuItem(await openMenu({ isArticleMode: false }), 'Article')).toBeUndefined()
    })

    it('toggles the article from the menu', async () => {
      const wrapper = await openMenu({ isArticleMode: true, showArticle: true })
      await menuItem(wrapper, 'chat.hideArticle').trigger('click')
      expect(wrapper.emitted('toggle-article')).toBeTruthy()
    })
  })

  describe('events', () => {
    it('should emit back event when back button is clicked', async () => {
      const wrapper = createWrapper()
      await wrapper.find('[aria-label="chat.back"]').trigger('click')
      expect(wrapper.emitted('back')).toBeTruthy()
    })
  })

  describe('overflow menu', () => {
    it('opens and closes, reflecting state in aria-expanded', async () => {
      const wrapper = createWrapper()
      const trigger = wrapper.find('[aria-label="chat.menu"]')
      expect(trigger.attributes('aria-expanded')).toBe('false')
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)

      await trigger.trigger('click')
      expect(trigger.attributes('aria-expanded')).toBe('true')
      expect(wrapper.find('[role="menu"]').exists()).toBe(true)

      await trigger.trigger('click')
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })

    it('closes on Escape', async () => {
      const wrapper = await openMenu()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })

    it('opens the vocabulary bank and closes itself', async () => {
      const wrapper = await openMenu()
      await menuItem(wrapper, 'chat.vocabBank').trigger('click')
      expect(wrapper.emitted('toggle-vocab-bank')).toBeTruthy()
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })

    it('shows memories only when there are some', async () => {
      expect(menuItem(await openMenu(), 'chat.memories')).toBeUndefined()
      const wrapper = await openMenu({ memoryCount: 2 })
      await menuItem(wrapper, 'chat.memories').trigger('click')
      expect(wrapper.emitted('show-memories')).toBeTruthy()
    })

    it('opens achievements (moved out of the header)', async () => {
      const wrapper = await openMenu()
      await menuItem(wrapper, 'chat.achievements').trigger('click')
      expect(wrapper.emitted('show-achievements')).toBeTruthy()
    })

    it('toggles dark mode', async () => {
      const wrapper = await openMenu()
      const item = menuItem(wrapper, 'chat.darkMode') || menuItem(wrapper, 'chat.lightMode')
      await item.trigger('click')
      expect(toggleDark).toHaveBeenCalled()
    })

    it('starts a new chat, disabled while loading', async () => {
      const loading = await openMenu({ isLoading: true })
      expect(menuItem(loading, 'chat.newChat').attributes('disabled')).toBeDefined()

      const wrapper = await openMenu({ isLoading: false })
      const renew = menuItem(wrapper, 'chat.newChat')
      expect(renew.attributes('disabled')).toBeUndefined()
      await renew.trigger('click')
      expect(wrapper.emitted('renew-chat')).toBeTruthy()
    })
  })
})
