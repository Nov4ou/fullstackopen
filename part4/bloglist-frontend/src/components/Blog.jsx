import { useState } from 'react'

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
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
      <div>
        {blog.title}
        <button onClick={toggleExpanded}>
          {expanded ? 'hide' : 'view'}
        </button>
      </div>

      {expanded && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button>like</button>
          </div>
          <div>{blog.author}</div>
        </div>
      )}
    </div>
  )
}

export default Blog