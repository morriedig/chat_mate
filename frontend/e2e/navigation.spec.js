import { test, expect } from '@playwright/test'

test.describe('Navigation - All routes accessible', () => {
  test('should load setup screen at root', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Chat Mate')).toBeVisible()
  })

  test('should show 3 mode options', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Chat Mode')).toBeVisible()
    await expect(page.getByText('Learning Mode')).toBeVisible()
    await expect(page.getByText('Diary', { exact: true })).toBeVisible()
  })

  test('should navigate to diary without prior setup', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByText('Diary', { exact: true }).first().click()
    await page.locator('button >> text=arrow_forward').click()
    await page.waitForURL(/.*diary/, { timeout: 5000 })
    await expect(page.locator('textarea')).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to learning', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByText('Learning Mode').first().click()
    // Select target language
    await page.locator('h3:text("日本語")').click()
    // Select level
    await page.locator('h3:text("Beginner")').click()
    // Click start
    await page.locator('button >> text=arrow_forward').click()
    await page.waitForURL(/.*learning/, { timeout: 5000 })
  })

  test('should navigate back from diary', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByText('Diary', { exact: true }).first().click()
    await page.locator('button >> text=arrow_forward').click()
    await page.waitForURL(/.*diary/)
    await page.locator('text=arrow_back').first().click()
    await page.waitForURL(/\/#\/?$/)
  })

  test('should navigate to settings and back', async ({ page }) => {
    await page.goto('/')
    await page.locator('text=settings').first().click()
    await page.waitForURL(/.*settings/)
    await page.locator('text=arrow_back').first().click()
    await page.waitForURL(/\/#\/?$/)
  })
})
