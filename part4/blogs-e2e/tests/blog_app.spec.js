const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'e2e-test',
        username: 'e2e-test',
        password: 'test'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('e2e-test')
      await page.getByTestId('password').fill('test')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('e2e-test logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('e2e-test')
      await page.getByTestId('password').fill('e2e-test')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('e2e-test')
      await page.getByTestId('password').fill('test')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('playwright test title')
      await page.getByTestId('author').fill('playwright test author')
      await page.getByTestId('url').fill('playwright test url')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('playwright test title', { exact: true })
      ).toBeVisible()
      await expect(
        page.getByText('playwright test author', { exact: true })
      ).toBeVisible()
    })

    test.only('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('playwright test title')
      await page.getByTestId('author').fill('playwright test author')
      await page.getByTestId('url').fill('playwright test url')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(
        page.getByText(/likes\s*0/)
      ).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(
        page.getByText(/likes\s*1/)
      ).toBeVisible()
    })
  })
})