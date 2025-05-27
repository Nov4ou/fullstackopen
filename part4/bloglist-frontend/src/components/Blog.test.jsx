import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import BlogForm from './BlogForm'

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

test('shows url and likes when the view button is clicked', async () => {
  const blog = {
    title: 'My awesome blog',
    author: 'Jane Doe',
    url: 'http://example.com',
    likes: 42,
    user: { username: 'passwd_is_passwd' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} currentUser={blog.user.username} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText(blog.title)).toBeDefined()
  expect(screen.getByText(blog.author)).toBeDefined()
  expect(screen.queryByText(blog.url)).toBeDefined()
  expect(screen.queryByText(/likes\s*42/)).toBeDefined()
})

test('if like button is clicked twice, handler is called twice', async () => {
  const blog = {
    title: 'My awesome blog',
    author: 'Jane Doe',
    url: 'http://example.com',
    likes: 42,
    user: { username: 'passwd_is_passwd' }
  }

  const mockLikeHandler = vi.fn()

  render(<Blog blog={blog} currentUser={blog.user.username} changeBlog={mockLikeHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockLikeHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> calls createBlog with right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  // screen.debug(input)
  const [titleInput, authorInput, urlInput] = inputs
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'test a form title')
  await user.type(authorInput, 'test a form author')
  await user.type(urlInput, 'test a form url')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'test a form title',
    author: 'test a form author',
    url: 'test a form url'
  })
})