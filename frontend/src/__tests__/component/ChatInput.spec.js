import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatInput from '../../components/chat/ChatInput.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

describe('ChatInput', () => {
  const createWrapper = (props = {}) => {
    return mount(ChatInput, {
      props: {
        modelValue: '',
        ...props
      }
    })
  }

  describe('rendering', () => {
    it('should render textarea', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('textarea').exists()).toBe(true)
    })

    it('should render send button', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should display placeholder text', () => {
      const wrapper = createWrapper()
      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('placeholder')).toBe('chat.typeMessage')
    })

    it('should show keyboard hints', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('Press Enter to send')
    })
  })

  describe('v-model', () => {
    it('should display initial value', () => {
      const wrapper = createWrapper({ modelValue: 'Hello' })
      const textarea = wrapper.find('textarea')
      expect(textarea.element.value).toBe('Hello')
    })

    it('should emit update:modelValue on input', async () => {
      const wrapper = createWrapper()
      const textarea = wrapper.find('textarea')

      await textarea.setValue('Test message')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Test message'])
    })

    it('should update local value when prop changes', async () => {
      const wrapper = createWrapper({ modelValue: 'Initial' })

      await wrapper.setProps({ modelValue: 'Updated' })

      const textarea = wrapper.find('textarea')
      expect(textarea.element.value).toBe('Updated')
    })
  })

  describe('send functionality', () => {
    it('should emit send event when send button is clicked', async () => {
      const wrapper = createWrapper({ modelValue: 'Test' })
      const sendButton = wrapper.find('button')

      await sendButton.trigger('click')

      expect(wrapper.emitted('send')).toBeTruthy()
    })

    it('should emit send event when Enter is pressed without Shift', async () => {
      const wrapper = createWrapper({ modelValue: 'Test' })
      const textarea = wrapper.find('textarea')

      await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })

      expect(wrapper.emitted('send')).toBeTruthy()
    })

    it('should not emit send event when Shift+Enter is pressed', async () => {
      const wrapper = createWrapper({ modelValue: 'Test' })
      const textarea = wrapper.find('textarea')

      await textarea.trigger('keydown', { key: 'Enter', shiftKey: true })

      expect(wrapper.emitted('send')).toBeFalsy()
    })

    it('should disable send button when input is empty', () => {
      const wrapper = createWrapper({ modelValue: '' })
      const sendButton = wrapper.find('button')

      expect(sendButton.attributes('disabled')).toBeDefined()
    })

    it('should disable send button when input is only whitespace', () => {
      const wrapper = createWrapper({ modelValue: '   ' })
      const sendButton = wrapper.find('button')

      expect(sendButton.attributes('disabled')).toBeDefined()
    })

    it('should enable send button when input has content', async () => {
      const wrapper = createWrapper({ modelValue: 'Hello' })
      const sendButton = wrapper.find('button')

      expect(sendButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('disabled state', () => {
    it('should disable textarea when disabled prop is true', () => {
      const wrapper = createWrapper({ disabled: true })
      const textarea = wrapper.find('textarea')

      expect(textarea.attributes('disabled')).toBeDefined()
    })

    it('should disable send button when disabled prop is true', () => {
      const wrapper = createWrapper({ modelValue: 'Test', disabled: true })
      const sendButton = wrapper.find('button')

      expect(sendButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('focus functionality', () => {
    it('should expose focus method', () => {
      const wrapper = createWrapper()
      expect(typeof wrapper.vm.focus).toBe('function')
    })

    it('should focus textarea when focus is called', async () => {
      const wrapper = createWrapper()
      const textarea = wrapper.find('textarea')

      // Mock focus
      const focusSpy = vi.spyOn(textarea.element, 'focus')

      wrapper.vm.focus()

      expect(focusSpy).toHaveBeenCalled()
    })
  })
})
