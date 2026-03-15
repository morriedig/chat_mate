import { test, expect } from '@playwright/test'

test.describe('Setup Screen - E2E', () => {
  test('should render without errors', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Chat Mate')).toBeVisible()
  })

  test('should show all 3 mode options on mobile', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Chat Mode')).toBeVisible()
    await expect(page.getByText('Learning Mode')).toBeVisible()
    await expect(page.getByText('Diary', { exact: true })).toBeVisible()
  })

  test('page should not have horizontal overflow', async ({ page }) => {
    await page.goto('/')
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(overflow).toBe(false)
  })

  test('should show learning options when learning selected', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Learning Mode').first().click()
    // Should show language cards (h3 headings)
    await expect(page.locator('h3:text("日本語")')).toBeVisible()
    // Should show level cards
    await expect(page.locator('h3:text("Beginner")')).toBeVisible()
  })

  test('start button should be enabled for diary mode', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Diary', { exact: true }).first().click()
    const startBtn = page.locator('button:has(span:text("arrow_forward"))').first()
    await expect(startBtn).toBeEnabled()
  })

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/')
    await page.locator('text=dark_mode').first().click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.locator('text=light_mode').first().click()
    await expect(page.locator('html')).toHaveClass(/light/)
  })
})
