import { test, expect } from '@playwright/test'

// Helper: navigate to diary page via the app UI
async function goToDiary(page) {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // Click the Diary text to select diary mode
  await page.getByText('Diary', { exact: true }).first().click()
  // Click the start button (contains arrow_forward icon)
  await page.locator('button >> text=arrow_forward').click()
  // Wait for diary page
  await page.waitForURL(/.*diary/, { timeout: 5000 })
  await page.waitForLoadState('networkidle')
}

test.describe('Diary Feature - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('chatmate_diary')) localStorage.removeItem(key)
      })
    })
  })

  test('should access diary from setup screen', async ({ page }) => {
    await goToDiary(page)
    await expect(page.locator('textarea')).toBeVisible({ timeout: 5000 })
  })

  test('should show textarea for writing', async ({ page }) => {
    await goToDiary(page)
    const textarea = page.locator('textarea')
    await expect(textarea).toBeVisible()
    await textarea.fill('Today I went to the park.')
    await expect(textarea).toHaveValue('Today I went to the park.')
  })

  test('should show word count while typing', async ({ page }) => {
    await goToDiary(page)
    await page.locator('textarea').fill('Hello world test words here now')
    await expect(page.getByText(/\d+\s*words/i)).toBeVisible({ timeout: 3000 })
  })

  test('should have submit button', async ({ page }) => {
    await goToDiary(page)
    await expect(page.getByText('Get Feedback').or(page.locator('button >> text=send'))).toBeVisible()
  })

  test('should auto-save draft', async ({ page }) => {
    await goToDiary(page)
    await page.locator('textarea').fill('Draft test entry for auto-save')
    await page.waitForTimeout(700)
    const draft = await page.evaluate(() => localStorage.getItem('chatmate_diary_draft'))
    expect(draft).toContain('Draft test entry for auto-save')
  })

  test('should restore draft after navigation', async ({ page }) => {
    await goToDiary(page)
    await page.locator('textarea').fill('Persistent draft content')
    await page.waitForTimeout(700)

    // Go home
    await page.locator('text=arrow_back').first().click()
    await page.waitForURL(/\/#\/?$/)
    // Go back to diary
    await goToDiary(page)
    await expect(page.locator('textarea')).toHaveValue('Persistent draft content')
  })

  test('should navigate back to home', async ({ page }) => {
    await goToDiary(page)
    await page.locator('text=arrow_back').first().click()
    await page.waitForURL(/\/#\/?$/)
    await expect(page.getByText('Chat Mate')).toBeVisible()
  })
})
