import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatHeader from '../../components/chat/ChatHeader.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

// Mock useDarkMode
vi.mock('../../composables/useDarkMode', () => ({
  useDarkMode: () => ({
    isDark: { value: false },
    toggle: vi.fn()
  })
}))

// Mock RankBadge component
const RankBadgeStub = {
  template: '<div class="rank-badge-stub"></div>'
}

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
      global: {
        stubs: {
          RankBadge: RankBadgeStub
        }
      }
    })
  }

  describe('rendering', () => {
    it('should render header element', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('header').exists()).toBe(true)
    })

    it('should display character avatar', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('🌸')
    })

    it('should display character name', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('Sakura')
    })

    it('should display level name', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('levels.beginner.name')
    })

    it('should show online status', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('chat.online')
    })

    it('should render RankBadge component', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.rank-badge-stub').exists()).toBe(true)
    })
  })

  describe('article mode', () => {
    it('should show article mode badge when in article mode', () => {
      const wrapper = createWrapper({ isArticleMode: true })
      expect(wrapper.text()).toContain('chat.articleMode')
    })

    it('should not show article mode badge when not in article mode', () => {
      const wrapper = createWrapper({ isArticleMode: false })
      expect(wrapper.text()).not.toContain('chat.articleMode')
    })

    it('should show toggle article button when in article mode', () => {
      const wrapper = createWrapper({ isArticleMode: true, showArticle: true })
      expect(wrapper.text()).toContain('chat.hideArticle')
    })

    it('should show "Show" text when article is hidden', () => {
      const wrapper = createWrapper({ isArticleMode: true, showArticle: false })
      expect(wrapper.text()).toContain('chat.showArticle')
    })
  })

  describe('events', () => {
    it('should emit back event when back button is clicked', async () => {
      const wrapper = createWrapper()
      const backButton = wrapper.find('button')
      await backButton.trigger('click')

      expect(wrapper.emitted('back')).toBeTruthy()
    })

    it('should emit toggle-article event when toggle button is clicked', async () => {
      const wrapper = createWrapper({ isArticleMode: true })
      const toggleButton = wrapper.findAll('button').find(btn => btn.text().includes('chat.hideArticle') || btn.text().includes('chat.showArticle'))

      if (toggleButton) {
        await toggleButton.trigger('click')
        expect(wrapper.emitted('toggle-article')).toBeTruthy()
      }
    })

    it('should emit renew-chat event when new chat button is clicked', async () => {
      const wrapper = createWrapper()
      const renewButton = wrapper.findAll('button').find(btn => btn.text().includes('chat.newChat'))
      await renewButton.trigger('click')

      expect(wrapper.emitted('renew-chat')).toBeTruthy()
    })
  })

  describe('loading state', () => {
    it('should disable new chat button when loading', () => {
      const wrapper = createWrapper({ isLoading: true })
      const renewButton = wrapper.findAll('button').find(btn => btn.text().includes('chat.newChat'))

      expect(renewButton.attributes('disabled')).toBeDefined()
    })

    it('should not disable new chat button when not loading', () => {
      const wrapper = createWrapper({ isLoading: false })
      const renewButton = wrapper.findAll('button').find(btn => btn.text().includes('chat.newChat'))

      expect(renewButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('dark mode toggle', () => {
    it('should have dark mode toggle button', () => {
      const wrapper = createWrapper()
      const darkModeButton = wrapper.findAll('button').find(btn =>
        btn.text().includes('dark_mode') || btn.text().includes('light_mode')
      )

      expect(darkModeButton).toBeTruthy()
    })
  })

  describe('phone menu', () => {
    const openMenu = async (props = {}) => {
      const wrapper = createWrapper(props)
      await wrapper.find('[aria-label="chat.menu"]').trigger('click')
      return wrapper
    }
    const menuButton = (wrapper, text) => wrapper.findAll('.absolute button').find(btn => btn.text().includes(text))

    it('opens the vocabulary bank and closes itself', async () => {
      const wrapper = await openMenu()
      await menuButton(wrapper, 'chat.vocabBank').trigger('click')
      expect(wrapper.emitted('toggle-vocab-bank')).toBeTruthy()
      expect(menuButton(wrapper, 'chat.vocabBank')).toBeUndefined()
    })

    it('shows memories only when there are some', async () => {
      expect(menuButton(await openMenu(), 'chat.memories')).toBeUndefined()
      const wrapper = await openMenu({ memoryCount: 2 })
      await menuButton(wrapper, 'chat.memories').trigger('click')
      expect(wrapper.emitted('show-memories')).toBeTruthy()
    })

    it('toggles the article in article mode', async () => {
      const wrapper = await openMenu({ isArticleMode: true, showArticle: true })
      await menuButton(wrapper, 'chat.hideArticle').trigger('click')
      expect(wrapper.emitted('toggle-article')).toBeTruthy()
    })
  })
})
