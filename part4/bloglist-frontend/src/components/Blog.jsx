import { useState } from 'react'

const Blog = ({ blog, changeBlog, removeBlog, currentUser }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const likeBlog = (event) => {
    event.preventDefault()
    changeBlog(blog.id, {
      user: blog.user,
      title: blog.title,
      author: blog.author,
      likes: blog.likes + 1,
      url: blog.url
    })
  }

  const showRemove = currentUser.username === blog.user.username
  const deleteBlog = (event) => {
    event.preventDefault()
    removeBlog(blog.id, blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div className='blog'>
        <span>{blog.title}</span>{' '}
        <span>{blog.author}</span>
        <button onClick={toggleExpanded}>
          {expanded ? 'hide' : 'view'}
        </button>
      </div>

      {expanded && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={likeBlog}>like</button>
          </div>
          {showRemove && (<div>
            <button onClick={deleteBlog}>remove</button>
          </div>)}

        </div>
      )}
    </div>
  )
}

export default Blog