import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const Notification = ({ message }) => {
  if (message === null)
    return null

  return (
    <div className={message.type}>
      {message.text}
    </div>
  )
}

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogVisible, setBlogVisible] = useState(false)

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [addMessage, setAddMessage] = useState({ text: null, type: '' })
  const [loginMessage, setLoginMessage] = useState({ text: null, type: '' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      console.log('logging in with', username, password)
    } catch (error) {
      setLoginMessage({ text: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setLoginMessage({ text: null, type: '' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreate = async (blogObject) => {
    const createdBlog = await blogService.create(blogObject)
    setAddMessage({ text: `a new blog ${createdBlog.title} by ${createdBlog.author} added`, type: 'success' })
    setTimeout(() => {
      setAddMessage({ text: null, type: '' })
    }, 5000)
    setBlogs(blogs.concat(createdBlog))
  }

  const handleLike = async (id, blogObject) => {
    const likedBlog = await blogService.like(id, blogObject)
    setBlogs(blogs.map(b =>
      b.id !== id ? b : likedBlog
    ))
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={loginMessage} />
        <Togglable buttonLabel="log in">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={addMessage} />
      <p>
        {user.username} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </p>

      <Togglable buttonLabel="new note">
        <BlogForm createBlog={handleCreate}
        />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} changeBlog={handleLike} />
      )}
    </div>
  )
}

export default App