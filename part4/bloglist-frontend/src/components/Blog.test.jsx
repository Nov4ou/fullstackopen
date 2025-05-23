import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders title and author, but not url or likes', () => {
  const blog = {
    title: 'My awesome blog',
    author: 'Jane Doe',
    url: 'http://example.com',
    likes: 42,
    user: { username: 'passwd_is_passwd' }
  }

  render(<Blog blog={blog} currentUser={blog.user.username} />)

  expect(screen.getByText(blog.title)).toBeDefined()
  expect(screen.getByText(blog.author)).toBeDefined()
  expect(screen.queryByText(blog.url)).toBeNull()
  expect(screen.queryByText(/likes\s*42/)).toBeNull()
})