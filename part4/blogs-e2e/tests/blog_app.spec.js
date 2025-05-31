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

    test('a blog can be liked', async ({ page }) => {
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

    test('the user who added the blog can delete the blog', async ({ page }) => {
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

      await page.getByRole('button', { name: 'view' }).click()

      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(
        page.getByText('playwright test title', { exact: true })
      ).not.toBeVisible()
      await expect(
        page.getByText('playwright test author', { exact: true })
      ).not.toBeVisible()
    })

    test('blogs sorted by likes', async ({ page, request }) => {
      const blogsToCreate = [
        {
          title: 'Blog with 2 likes',
          author: 'e2e-test',
          url: 'http://example.com/2',
          likes: 2
        },
        {
          title: 'Blog with 5 likes',
          author: 'e2e-test',
          url: 'http://example.com/5',
          likes: 5
        },
        {
          title: 'Blog with 1 like',
          author: 'e2e-test',
          url: 'http://example.com/1',
          likes: 1
        }
      ]

      await page.getByRole('button', { name: 'new blog' }).click()
      for (const blog of blogsToCreate) {
        await page.getByTestId('title').fill(blog.title)
        await page.getByTestId('author').fill(blog.author)
        await page.getByTestId('url').fill(blog.url)
        await page.getByRole('button', { name: 'create' }).click()

        await expect(page.getByText(blog.title, { exact: true })).toBeVisible()
      }

      const blogWrappers = page.locator('.blog').locator('..')
      await expect(blogWrappers).toHaveCount(3)

      // await page.pause()
      // Note: Can't use nth(i) because the order will be changed as likes increase

      for (const blog of blogsToCreate) {
        const { title, likes: targetLikes } = blog
        const blogTitleDiv = page.locator('.blog', { hasText: title })
        const blogWrapper = blogTitleDiv.locator('..')
        await blogWrapper.getByRole('button', { name: 'view' }).click()
        await expect(blogWrapper.getByText(/likes\s*0/)).toBeVisible()
        for (let j = 0; j < targetLikes; j++) {
          await expect(blogWrapper.getByRole('button', { name: 'like' })).toBeVisible()
          await blogWrapper.getByRole('button', { name: 'like' }).click()
          await expect(
            blogWrapper.getByText(new RegExp(`likes\\s*${j + 1}`))
          ).toBeVisible()
        }
      }

      const sortedWrappers = page.locator('.blog').locator('..')
      await expect(sortedWrappers).toHaveCount(3)
      await expect(sortedWrappers.nth(0).locator('.blog')).toContainText('Blog with 5 likes')
      await expect(sortedWrappers.nth(1).locator('.blog')).toContainText('Blog with 2 likes')
      await expect(sortedWrappers.nth(2).locator('.blog')).toContainText('Blog with 1 like')
    })
  })

  describe('another user logged in', () => {
    test('only the user who added the blog sees the remove button', async ({ page, request }) => {
      const userA = { name: 'userA', username: 'userA', password: 'passwordA' }
      const userB = { name: 'userB', username: 'userB', password: 'passwordB' }
      // await page.pause()
      await request.post('http://localhost:3003/api/users', { data: userA })
      await request.post('http://localhost:3003/api/users', { data: userB })

      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('userA')
      await page.getByTestId('password').fill('passwordA')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('userA logged in')).toBeVisible()

      // UserA create a blog
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Blog created by userA')
      await page.getByTestId('author').fill('userA')
      await page.getByTestId('url').fill('urlA')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(
        page.getByText('Blog created by userA', { exact: true })
      ).toBeVisible()
      await expect(
        page.getByText('userA', { exact: true })
      ).toBeVisible()

      // Log out
      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('userB')
      await page.getByTestId('password').fill('passwordB')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('userB logged in')).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(
        page.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()
    })
  })
})